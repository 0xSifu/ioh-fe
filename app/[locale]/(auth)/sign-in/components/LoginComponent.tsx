"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { FingerprintIcon } from "lucide-react";

export function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const status = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      });

      if (status?.error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: status.error,
        });
      } else if (status?.ok) {
        toast({
          title: "Login Successful",
          description: "Redirecting...",
        });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg my-5">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to log in.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isLoading}
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/* <FingerprintIcon size={20} className="text-gray-400" /> */}
                    </span>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 py-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex gap-2 h-12"
              >
                {isLoading && <span className="border rounded-full px-3 py-2 animate-spin">Q</span>}
                <span className={isLoading ? "hidden" : ""}>Login</span>
                {isLoading && <span>Loading ...</span>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-5">
        <div className="text-sm text-gray-500">
          Need an account? Register{" "}
          <Link href="/register" className="text-blue-500">
            here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
