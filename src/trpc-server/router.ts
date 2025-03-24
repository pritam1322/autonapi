import { PricingPlan, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from ".";




const prisma = new PrismaClient();

// Define valid types
const validAuthTypes = ["API_KEY", "OAUTH", "NONE"] as const;
type AuthType = (typeof validAuthTypes)[number];

const validPricingPlans = ["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"] as const;
type PricingPlans = (typeof validPricingPlans)[number];

export const appRouter = router({
    // create API router
    createAPI: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, "API Name must be at least 3 characters."),
        description: z.string().min(10, "Description must be at least 10 characters."),
        endpoint: z.string().url("Enter a valid API endpoint."),
        authType: z.enum(["API_KEY", "OAUTH", "NONE"]),
        pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]),
        providerId: z.string(),
        usageLimit: z.number().int().positive("Usage limit must be positive"),
        pricePerRequest: z.number().positive().optional(), // Optional for PAY_PER_REQUEST
        monthlyPrice: z.number().positive().optional(), // Optional for SUBSCRIPTION
        monthlyLimit: z.number().int().positive().optional(), // Optional for SUBSCRIPTION
      })
    )
    .mutation(async ({ input }) => {
      try {

        // 🔹 Create API Entry
        const newAPI = await prisma.aPI.create({
          data: {
            name: input.name,
            description: input.description,
            endpoint: input.endpoint,
            authType: input.authType,
            pricing: input.pricing,
            providerId: input.providerId,
            pricePerRequest: input.pricePerRequest ?? null, // Ensures proper handling of optional fields
            monthlyPrice: input.monthlyPrice ?? null,
            monthlyLimit: input.monthlyLimit ?? null,
          },
        });

        // 🔹 Create Usage Limit Entry
        await prisma.usageLimit.create({
          data: {
            apiId: newAPI.id,
            plan: input.pricing as PricingPlan,
            limit: input.usageLimit, // Dynamically set limit
          },
        });

        return { success: true, data: newAPI };
      } catch (error) {
        console.error("Error creating API:", error);
        throw new Error("Failed to create API. Please try again.");
      }
    }),




    // Update API
    updateAPI: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3, "API Name must be at least 3 characters."),
        description: z.string().min(10, "Description must be at least 10 characters."),
        endpoint: z.string().url("Enter a valid API endpoint."),
        authType: z.enum(["API_KEY", "OAUTH", "NONE"]),
        pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]),
        providerId: z.string(),
        pricePerRequest: z.number().optional(),  // String input
        monthlyPrice: z.number().optional(),  // String input
        monthlyLimit: z.number().optional(),  // String input
        usageLimit: z.number().optional(),  // String input
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if API exists and belongs to the provider
        const existingAPI = await prisma.aPI.findUnique({
          where: { id: input.id },
        });

        if (!existingAPI) {
          throw new Error("API not found.");
        }

        if (existingAPI.providerId !== input.providerId) {
          throw new Error("Unauthorized: You can only update your own APIs.");
        }

        // Update the API
        const updatedAPI = await prisma.aPI.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            endpoint: input.endpoint,
            authType: input.authType ,
            pricing: input.pricing as PricingPlan,
            pricePerRequest: input.pricePerRequest!, // Convert to number
            monthlyPrice: input.monthlyPrice!, // Convert to number
            monthlyLimit: input.monthlyLimit!, // Convert to number
          },
        });

        await prisma.usageLimit.update({
          where: { 
            apiId_plan: {  
              apiId: updatedAPI.id,
              plan: input.pricing as PricingPlan, // Ensure you are using the correct plan
            },
          },
          data: {
            limit: input.usageLimit, // Dynamically update limit
          },
        });
        

        return { success: true, data: updatedAPI };
      } catch (error) {
        console.error("Error updating API:", error);
        throw new Error("Failed to update API. Please try again.");
      }
    }),




    // get user by id
    getuser:publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.user.findUnique({ where: { id: input.id } });
    }),


    // Fetch APIs by providerId
    getAPIs: publicProcedure
    .input(
      z.object({
        providerId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.aPI.findMany({
        where: input.providerId ? { providerId: input.providerId } : {},
        orderBy: { createdAt: "desc" }, // Fetch latest APIs first
      });
    }),

    getAPIById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const api = await prisma.aPI.findUnique({
      where: { id: input.id },
    });

    if (!api) throw new Error("Failed to fetch APIs. Please try again.");

    return {
      ...api,
      authType: validAuthTypes.includes(api.authType as AuthType)
        ? (api.authType as AuthType)
        : "NONE",
      pricing: validPricingPlans.includes(api.pricing as PricingPlan)
        ? (api.pricing as PricingPlans)
        : "FREE",
      pricePerRequest: api.pricePerRequest ?? undefined,
      monthlyPrice: api.monthlyPrice ?? undefined,
      monthlyLimit: api.monthlyLimit ?? undefined,
    };
  }),


    deleteAPI: publicProcedure
    .input(
      z.object({
        apiId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { apiId } = input;

        // Ensure the API exists before deleting
        const api = await prisma.aPI.findUnique({
          where: { id: apiId },
        });

        if (!api) {
          throw new Error("API not found");
        }

        // Delete the API
        await prisma.aPI.delete({
          where: { id: apiId },
        });

        return { success: true, message: "API deleted successfully" };
      } catch (error) {
        throw new Error(`Error deleting API: ${error}`);
      }
    }),

    getUsageLimit: publicProcedure
    .input(
      z.object({
        apiId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const usageLimit = await prisma.usageLimit.findFirst({
        where: { apiId: input.apiId },
      });

      if (!usageLimit) {
        throw new Error("usageLimit not found");
      }

      return { 
        ...usageLimit,
        limit: usageLimit.limit ?? undefined
       };
    }),
});

export type AppRouter = typeof appRouter;