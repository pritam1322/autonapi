import { PricingPlan, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from ".";




const prisma = new PrismaClient();

export const appRouter = router({
    // create API router
    createAPI: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, "API Name must be at least 3 characters."),
        description: z.string().min(10, "Description must be at least 10 characters."),
        endpoint: z.string().url("Enter a valid API endpoint."),
        authType: z.enum(["API Key", "OAuth", "None"]),
        pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]), // Updated to match the PricingPlan Enum
        providerId: z.string(),
        usageLimit: z.number().int().positive("Usage limit must be positive"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const newAPI = await prisma.aPI.create({
          data: {
            name: input.name,
            description: input.description,
            endpoint: input.endpoint,
            authType: input.authType,
            pricing: input.pricing, // Now consistent with PricingPlan
            providerId: input.providerId,
          },
        });

        await prisma.usageLimit.create({
          data: {
            apiId: newAPI.id,
            plan: input.pricing as PricingPlan, // Ensures pricing and plan are consistent
            limit: input.usageLimit,
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
            authType: z.enum(["API Key", "OAuth", "None"]),
            pricing: z.enum(["Free", "Pay-per-Request", "Subscription"]),
            providerId: z.string(),
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
                    authType: input.authType,
                    pricing: input.pricing,
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

    // getAPI
    getAPIById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const api = await prisma.aPI.findUnique({
        where: { id: input.id },
      });

      if(!api) throw new Error("Failed to fetch APIs. Please try again.");

      return {
        ...api,
        authType: api.authType as "API Key" | "OAuth" | "None",
        pricing: api.pricing as "Free" | "Pay-per-Request" | "Subscription",
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
});

export type AppRouter = typeof appRouter;