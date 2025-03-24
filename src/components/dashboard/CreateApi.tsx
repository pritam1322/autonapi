"use client";

import { useState } from "react";
import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Validation Schema
const uploadAPISchema = z.object({
  name: z.string().min(3, "API Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  endpoint: z.string().url("Enter a valid API endpoint."),
  authType: z.enum(["API_KEY", "OAUTH", "NONE"]),
  pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]),
  pricePerRequest: z.number().min(0.01, "Must be at least $0.01").optional(),
  monthlyPrice: z.number().min(1, "Must be at least $1").optional(),
  monthlyLimit: z.number().min(1, "Must be at least 1 request").optional(),
  usageLimit: z.number().min(1, "Usage limit must be at least 1.").optional(),
});

type UploadAPIForm = z.infer<typeof uploadAPISchema>;

export function CreateAPI({ className = "" }: { className?: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // Track modal step

  const api = trpc.createAPI.useMutation();

  const userId = session?.user?.id || undefined;
  const { data: user } = trpc.getuser.useQuery({ id: userId! });

  const form = useForm<UploadAPIForm>({
    resolver: zodResolver(uploadAPISchema),
    defaultValues: {
      name: "",
      description: "",
      endpoint: "",
      authType: "API_KEY",
      pricing: "FREE",
      usageLimit: undefined,
    },
  });

  const pricing = form.watch("pricing");

  const onSubmit = async (values: UploadAPIForm) => {
    try {
      if (user && user.role !== "PROVIDER") {
        toast.error("Only providers can create APIs.");
        return;
      }

      const res = await api.mutateAsync({
        name: values.name,
        description: values.description,
        endpoint: values.endpoint,
        authType: values.authType,
        pricing: values.pricing,
        pricePerRequest: values.pricePerRequest,
        monthlyPrice: values.monthlyPrice,
        monthlyLimit: values.monthlyLimit,
        providerId: userId!,
        usageLimit: values.usageLimit!,
      });

      if (res) {
        toast.success("API uploaded successfully!");
        setOpen(false);
        setStep(1);
        window.location.reload();
      } else {
        toast.error("Failed to upload API. Please try again.");
      }
    } catch (error) {
      console.error("Upload API Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); setStep(1); }}>
      <DialogTrigger asChild>
        <Button className={className}>Build API</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Build API - Step {step}/2</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
            {/* Step 1: API Details */}
            {step === 1 && (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Name</FormLabel>
                    <FormControl><Input placeholder="Enter API name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Input placeholder="Enter API description" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endpoint" render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Endpoint</FormLabel>
                    <FormControl><Input placeholder="https://api.example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {/* Step 2: Auth & Pricing */}
            {step === 2 && (
              <>
                <div className="flex gap-4 w-full">
                  <FormField control={form.control} name="authType" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Authentication Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="API_KEY">API Key</SelectItem>
                          <SelectItem value="OAUTH">OAuth</SelectItem>
                          <SelectItem value="NONE">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pricing" render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Pricing</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="FREE">Free</SelectItem>
                          <SelectItem value="PAY_PER_REQUEST">Pay-per-Request</SelectItem>
                          <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  
                </div>
              
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


                {/* Show Price Per Request if Pay-per-Request is selected */}
                {pricing === "PAY_PER_REQUEST" && (
                  <FormField control={form.control} name="pricePerRequest" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Request ($)</FormLabel>
                      <FormControl><Input type="number" placeholder="Enter price per request" onChange={(e) => field.onChange(e.target.valueAsNumber)}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
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
              </>
            )}

            <DialogFooter>
              {step === 1 && <Button onClick={() => setStep(2)}>Next</Button>}
              {step === 2 && <Button type="submit">Submit</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
