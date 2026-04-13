"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "next/navigation";

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
import { Loader2 } from "lucide-react";
import { verifyOtpSchema } from "@/schema/VerifyOTPSchema";

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const { token } = useParams<{ token: string }>();
  const onSubmit = async (data: z.infer<typeof verifyOtpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/verify-email", {
        otp: data.otp,
        token,
      });

      toast.success("Success", {
        description: response.data.message,
        position: "bottom-right",
      });

      router.replace(`/sign-in`);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message;

        toast.error("Verification Error", {
          description: message ?? "Something went wrong",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full space-y-6 max-w-md">
        <h2 className="text-2xl font-bold text-center">Verfication</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
  control={form.control}
  name="otp"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Verification code</FormLabel>
      <FormControl>
        <Input
          {...field}
          maxLength={6}
          inputMode="numeric"
          placeholder="Enter 6-digit code"
          className="text-center tracking-widest text-lg"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />{" "}
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </Form>
        <div></div>
      </div>
    </div>
  );
}
