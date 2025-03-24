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

const updateAPISchema = z.object({
  id: z.string(),
  name: z.string().min(3, "API Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  endpoint: z.string().url("Enter a valid API endpoint."),
  authType: z.enum(["API_KEY", "OAUTH", "NONE"]),
  pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]),
  pricePerRequest: z.number().optional(),
  monthlyPrice: z.number().optional(),
  monthlyLimit: z.number().optional(),
  usageLimit: z.number().optional(),
});

type UpdateAPIForm = z.infer<typeof updateAPISchema>;

export function UpdateAPI({ apiId, setOpen }: { apiId: string; setOpen: (open: boolean) => void }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { data: apiData, isLoading: isFetching } = trpc.getAPIById.useQuery({ id: apiId });
  const { data: usageLimitRec } = trpc.getUsageLimit.useQuery({ apiId: apiId });
  console.log(usageLimitRec);
  const updateApi = trpc.updateAPI.useMutation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateAPIForm>({
    resolver: zodResolver(updateAPISchema),
    defaultValues: {
      id: apiId,
      name: apiData?.name || "",
      description: apiData?.description || "",
      endpoint: apiData?.endpoint || "",
      authType: apiData?.authType || "API_KEY",
      pricing: apiData?.pricing || "FREE",
      pricePerRequest: apiData?.pricePerRequest || undefined,
      monthlyPrice: apiData?.monthlyPrice || undefined,
      monthlyLimit: apiData?.monthlyLimit || undefined,
      usageLimit:  usageLimitRec?.limit || undefined,
    },
  });
  

  const pricing = form.watch("pricing");

  // Ensure form resets only when API data is fetched
  useEffect(() => {
    if (apiData && !isFetching) {
      form.reset(apiData);
    }
  }, [apiData, isFetching, form]);

  const onSubmit = async (values: UpdateAPIForm) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      console.log("Submitting API update:", values);
  
      await updateApi.mutateAsync({
        providerId: userId!,
        ...values,
      });
  
      toast("API updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log("Update API Error:", error);
      toast("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        {step === 1 ? (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>API Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter API name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter API description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="endpoint" render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </>
        ) : (
          <>
            <FormField control={form.control} name="pricing" render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pricing Model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="PAY_PER_REQUEST">Pay Per Request</SelectItem>
                    <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {form.watch("pricing") !== "FREE" && (
              <>
                <FormField control={form.control} name="pricePerRequest" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Request</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {/* Usage Limit */}
          <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter usage limit" onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </>
        )}

        {/* Show Subscription details if selected */}
        {pricing === "SUBSCRIPTION" && (
            <>
              <FormField control={form.control} name="monthlyPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price ($)</FormLabel>
                  <FormControl><Input type="number" placeholder="Enter monthly price" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="monthlyLimit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Request Limit</FormLabel>
                  <FormControl><Input type="number" placeholder="Enter request limit" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          

        <div className="flex gap-4">
          {step === 2 && (
            <Button type="button" onClick={() => setStep(1)} variant="outline">
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button type="button" onClick={(e) => { e.preventDefault(); 
              setStep(2)
            }}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
