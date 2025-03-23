"use client";

import { useState } from "react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define form validation schema
const uploadAPISchema = z.object({
  name: z.string().min(3, "API Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  endpoint: z.string().url("Enter a valid API endpoint."),
  authType: z.enum(["API Key", "OAuth", "None"]),
  pricing: z.enum(["FREE", "PAY_PER_REQUEST", "SUBSCRIPTION"]),
  usageLimit: z.number().min(1, "Usage limit must be at least 1.").optional(),
});

type UploadAPIForm = z.infer<typeof uploadAPISchema>;

export function CreateAPI({ className = "" }: { className?: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const router = useRouter();
  const api = trpc.createAPI.useMutation();

  const userId = session?.user?.id || undefined;

  const { data: user } = trpc.getuser.useQuery({ id: userId! });

  const form = useForm<UploadAPIForm>({
    resolver: zodResolver(uploadAPISchema),
    defaultValues: {
      name: "",
      description: "",
      endpoint: "",
      authType: "API Key",
      pricing: "FREE",
      usageLimit: undefined,
    },
  });

  const onSubmit = async (values: UploadAPIForm) => {
    try {

        if( user && user.role !== 'PROVIDER'){
            toast.error("Only providers can create APIs.");
            return;
        }
        // Upload API data
        const res = await api.mutateAsync({ 
                name: values.name, 
                description: values.description, 
                endpoint: values.endpoint,
                authType: values.authType,
                pricing: values.pricing,
                usageLimit: values.usageLimit!,
                providerId: userId!
            });

      if (res) {
        toast.success("API uploaded successfully!");
        //router.push("/provider/dashboard");
      } else {
        toast.error("Failed to upload API. Please try again.");
      }
    } catch (error) {
      console.error("Upload API Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if ( user  && user.role !== 'PROVIDER' ) {
    router.back();
  } 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>Build API</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Build API</DialogTitle>
        </DialogHeader>
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

            <div className="flex gap-4 w-full">
              {/* Auth Type */}
              <FormField
                control={form.control}
                name="authType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Authentication Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
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
                  <FormItem className="w-full">
                    <FormLabel>Pricing</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="PAY_PER_REQUEST">Pay-per-Request</SelectItem>
                        <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
            </div>
            

            {/* Usage Limit */}
            <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter usage limit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            {/* Submit Button */}
            <Button type="submit" className="px-4 py-2 rounded">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
