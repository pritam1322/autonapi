import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { prisma } from '@/trpc-server/prisma';
import redis from '@/lib/redis';  // Import Redis client

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, name, role } = body;
    
    const cacheKey = `user:${email}`;

    // Check Redis cache first
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
        return NextResponse.json({ error: 'User already exists (from cache)' }, { status: 400 });
    }

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {

        const userData = { id: existingUser.id, email: existingUser.email, name: existingUser.name };
        // Store user in Redis for 1 hour
        await redis.setex(cacheKey, 3600, JSON.stringify(userData)); // Upstash uses setex for expiry
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(password, salt);

    // Create a new user
    const user = await prisma.user.create({
        data: {
            email,
            password,
            name,
            role
        },
    });

    // Store new user in Redis for quick access (omit password)
    const userData = { id: user.id, email: user.email, name: user.name };
    await redis.setex(cacheKey, 3600, JSON.stringify(userData)); // Upstash uses setex for expiry

    // Respond with the created user
    return NextResponse.json({ user: userData }, { status: 201 });
}