import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/trpc-server/prisma";
import bcrypt from "bcryptjs";
import redis from "./redis";


interface User {
  id: string;
  email: string;
  name?: string | null;  // Allow null values
  image?: string | null;
  role?: string | null;
  password?: string | null;
  gmailAccessToken?: string | null;
  gmailRefreshToken?: string | null;
}


interface UserCache {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  gmailAccessToken?: string | null | undefined;
  gmailRefreshToken?: string | null | undefined;
}

const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const cacheKey = `user:${credentials.email}`;
        
        // Check Redis cache first
        const cachedUser: string | null = await redis.get(cacheKey);
        let user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

        if (!user) {
          // Fetch user from database if not in cache
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            // Store user in Redis (without password)
            const userData = { id: user.id, email: user.email, name: user.name };
            await redis.setex(cacheKey, 3600, JSON.stringify(userData)); // Upstash setex
          }
        }

        if (!user || !user.password) {
          console.error("No user found with the given email.");
          throw new Error("Invalid email or password.");
        }

        const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
        if (!isValidPassword) {
          console.error("Incorrect password.");
          throw new Error("Invalid email or password.");
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      const cacheKey = `user:${user.email}`;
      let currentUser: UserCache | null = null;
    
      const cachedUser: string | null = await redis.get(cacheKey);
      if (cachedUser) {
        currentUser = JSON.parse(cachedUser) as UserCache;
      } else {
        currentUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, email: true, name: true },
        });

        if (currentUser) {
          await redis.setex(cacheKey, 3600, JSON.stringify(currentUser)); // Upstash setex
        }
      }

      if (!currentUser && account?.provider === "google") {
        currentUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            image: user.image ?? undefined,
            role: "CONSUMER",
            gmailAccessToken: account.access_token,
            gmailRefreshToken: account.refresh_token,
          },
        });

        // Cache the new user in Redis
        await redis.setex(cacheKey, 3600, JSON.stringify(currentUser));
      }

      if (!currentUser) {
        throw new Error("User not found. Please sign up first.");
      }

      if (!currentUser.id) {
        throw new Error("User ID is missing.");
      }

      if (account?.provider === "google") {
        await prisma.account.upsert({
          where: { userId: currentUser.id },
          update: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          },
          create: {
            userId: currentUser.id,
            type: "oauth",
            provider: "google",
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
          },
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as User).role,
        };
      }

      if (account?.access_token) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as UserCache;
        session.user.role = token.user.role as string;
      }
      if (token.access_token) {
        session.user.gmailAccessToken = token.access_token;
      }
      if (token.refresh_token) {
        session.user.gmailRefreshToken = token.refresh_token;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
