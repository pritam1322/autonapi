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
import { CircleCheck } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";

import { toast } from "sonner"
import { signIn } from "next-auth/react";
import LoginButton from "@/components/landingpages/LoginButton";



// Define form validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {

    const router = useRouter();
    
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await signIn('credentials', {
                redirect: false, // Don't redirect automatically
                email: values.email,
                password: values.password,
            });
        
            if (result?.error) {
                console.log(result.error); // Handle error
                toast('Wrong Creds');
            } else {
            router.push('/'); 
            }
        }catch(error){
        toast("Error message - " + error );
        console.log(error);
        }
    }

    const handleAutofillEmailPassword = () => {
        form.setValue("email", "free@example.com");
        form.setValue("password", "free123");
    }

    return (
        <section className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
            <CardHeader>
            <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
            <LoginButton />
            <div className='rounded-lg shadow-lg bg-gray-200 text-black my-4 p-1 flex max-w-30 mx-auto'>
                <button onClick={handleAutofillEmailPassword} className="w-full font-semibold">
                Guest Login
                </button>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

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

                <div className="flex justify-center mt-6">
                    <Button type="submit" className="w-full">
                    Login
                    </Button>
                </div>

                <div>
                    <Link href="/" className="flex space-x-2 items-center justify-end text-sm text-blue-400 hover:text-red-500">
                    <CircleCheck className="h-4" />
                    Forgot your password?
                    </Link>
                </div>
                </form>
            </Form>
            </CardContent>
        </Card>
        </section>
    );
}