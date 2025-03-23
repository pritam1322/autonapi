"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form validation schema
const updateAPISchema = z.object({
  id: z.string(),
  name: z.string().min(3, "API Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  endpoint: z.string().url("Enter a valid API endpoint."),
  authType: z.enum(["API Key", "OAuth", "None"]),
  pricing: z.enum(["Free", "Pay-per-Request", "Subscription"]),
});

type UpdateAPIForm = z.infer<typeof updateAPISchema>;

export function UpdateAPI({ apiId, setOpen }: { apiId: string; setOpen: (open: boolean) => void }) {
  const { data: session } = useSession();

  const router = useRouter();

  const { data: apiData } = trpc.getAPIById.useQuery({ id: apiId });
  const updateApi = trpc.updateAPI.useMutation();

  const form = useForm<UpdateAPIForm>({
    resolver: zodResolver(updateAPISchema),
    defaultValues: {
      id: apiId,
      name: "",
      description: "",
      endpoint: "",
      authType: "API Key",
      pricing: "Free",
    },
  });

  // Populate form when API data is fetched
  useEffect(() => {
    if (apiData) {
      form.reset(apiData);
    }
  }, [apiData, form]);

  const onSubmit = async (values: UpdateAPIForm) => {
    try {
      await updateApi.mutateAsync({
        id: values.id, // Include the id
        providerId: apiData?.providerId ?? "", // Ensure providerId is included
        name: values.name,
        description: values.description,
        endpoint: values.endpoint,
        authType: values.authType,
        pricing: values.pricing,
      });
      toast.success("API updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Update API Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
            {/* API Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter API name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter API description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* API Endpoint */}
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              {/* Auth Type */}
              <FormField
                control={form.control}
                name="authType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authentication Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an auth type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="API Key">API Key</SelectItem>
                        <SelectItem value="OAuth">OAuth</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing */}
              <FormField
                control={form.control}
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Pay-per-Request">Pay-per-Request</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="px-4 py-2 rounded">
              Update API
            </Button>
          </form>
        </Form>
  );
}
