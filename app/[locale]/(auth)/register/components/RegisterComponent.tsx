"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React from "react";
import { FingerprintIcon, Link } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function RegisterComponent() {
  const router = useRouter();
  const { toast } = useToast();

  // Local states
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [show, setShow] = React.useState<boolean>(false);

  const formSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    language: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  });

  type RegisterFormValues = z.infer<typeof formSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      language: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, handleSubmit, setValue, getValues, formState: { errors } } = form;

  const onClickHandler = async () => {
    const result = await handleSubmit(async (data) => {
      try {
        setIsLoading(true);
        console.log('Form submitted with data:', data);

        const response = await fetch('http://localhost:9001/api/v1/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), 
        });
        console.log('Response status:', response.status); 
        if (response.ok) {
          console.log('Account created');
          toast({
            title: "Success",
            description: "Your account has been created.",
          });
          router.push('/');
        } else {
          console.error('Failed to create account');
          toast({
            title: "Error",
            description: "Failed to create account.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('An error occurred:', error);
        toast({
          title: "Error",
          description: "An error occurred during registration.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  };

  // Localizations
  const t = useTranslations("RegisterComponent");

  return (
    <Card className="shadow-lg ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("cardTitle")}</CardTitle>
        <CardDescription>{t("cardDescription")}:</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or create new account
            </span>
          </div>
        </div>
        <Form {...form}>
          <form>
            <div className="grid gap-2">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="name@domain.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="jdoe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose your language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="flex overflow-y-auto h-56">
                        {["en", "de", "cz", "uk"].map(
                          (lng: string, index: number) => (
                            <SelectItem key={index} value={lng}>
                              {t("locale", { locale: lng })}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center w-full ">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          disabled={isLoading}
                          placeholder="Password"
                          type={show ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span
                  className="flex px-4 pt-7 w-16"
                  onClick={() => setShow(!show)}
                >
                  <FingerprintIcon size={25} className="text-gray-400" />
                </span>
              </div>
              <div className="flex items-center w-full ">
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          disabled={isLoading}
                          placeholder="Confirm Password"
                          type={show ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span
                  className="flex px-4 pt-7 w-16"
                  onClick={() => setShow(!show)}
                >
                  <FingerprintIcon size={25} className="text-gray-400" />
                </span>
              </div>
            </div>

            <div className="grid gap-2 py-5">
              <Button
                disabled={isLoading}
                type="button"
                onClick={onClickHandler}
              >
                Create account
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-5">
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-blue-500">
            sign-in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
