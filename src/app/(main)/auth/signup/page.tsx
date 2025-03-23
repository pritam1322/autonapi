"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

import { toast } from "sonner"
import LoginButton from "@/components/landingpages/LoginButton";



// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"], {
    required_error: "Please select a role",
  }),
});

export default function SignUp() {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CONSUMER",
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const hashedPassword = await bcrypt.hash(values.password, 10);

      const res = await fetch("/api/signup", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email:values.email, password: hashedPassword, name: values.name, usertype: values.role }),
      });

      if (res.ok) {
          toast("User created successfully!");
          router.push("/auth/login");
          console.log(res.body);
      } else {
          console.log("Signup failed");
      }
    }catch(error){
      toast("Error message - " + error );
      console.log(error);
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign-up</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginButton />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "name"> }) => (
                  <FormItem>
                    <FormLabel className="pl-1">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "email"> }) => (
                  <FormItem>
                    <FormLabel className="pl-1">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "password"> }) => (
                  <FormItem>
                    <FormLabel className="pl-1">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Type Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "role"> }) => (
                  <FormItem>
                    <FormLabel className="pl-1">Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="CONSUMER">CONSUMER</SelectItem>
                            <SelectItem value="PROVIDER">PROVIDER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center mt-6">
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>

              <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}