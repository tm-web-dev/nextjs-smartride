"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  applicationSchema,
  ApplicationFormType,
} from "@/schema/applicationSchema";

export default function ApplyPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormType>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormType) => {
    try {
      setLoading(true);
      await axios.post("/api/application/apply", data);
      alert("Application saved successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-card border rounded-[32px] shadow-sm overflow-hidden my-4">
        
        {/* HEADER */}
        <div className="border-b px-6 md:px-16 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground">
            Bus Concession Application
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] leading-7">
            Fill in all details carefully and upload valid documents before proceeding to payment.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-16 space-y-16"
        >
          {/* PERSONAL INFO */}
          <section className="space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Personal Information
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your personal and address details.
              </p>
            </div>

            {/* NAME + EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Full Name
                </Label>
                <Input
                  disabled
                  value={session?.user?.name || ""}
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Email Address
                </Label>
                <Input
                  disabled
                  value={session?.user?.email || ""}
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
              </div>
            </div>

            {/* PHONE + GENDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* PHONE */}
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* GENDER - Added relative and high z-index layout class to prevent overlay bleeding */}
              <div className="space-y-4 relative z-50">
                <Label className="text-sm font-medium pl-1">
                  Gender
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female" | "other")
                  }
                >
                  <SelectTrigger className="w-full h-13 px-5 rounded-2xl text-[15px] bg-background border border-input text-left flex items-center justify-between">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  
                  {/* position="popper" bypasses alignment glitches in constrained multi-column flex setups */}
                  <SelectContent position="popper" className="w-full rounded-2xl bg-popover text-popover-foreground shadow-md border z-[100] mt-1">
                    <SelectItem value="male" className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground">Male</SelectItem>
                    <SelectItem value="female" className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground">Female</SelectItem>
                    <SelectItem value="other" className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-4">
              <Label className="text-sm font-medium pl-1">
                Address
              </Label>
              <Textarea
                {...register("address")}
                placeholder="Enter complete address"
                className="min-h-[140px] rounded-2xl px-5 py-4 text-[15px] leading-relaxed"
              />
              {errors.address && (
                <p className="text-sm text-red-100 pl-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* DISTRICT + PIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  District
                </Label>
                <Input
                  {...register("district")}
                  placeholder="Enter district"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.district && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  PIN Code
                </Label>
                <Input
                  {...register("pinCode")}
                  placeholder="Enter PIN code"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.pinCode && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOB + AADHAAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  {...register("dateOfBirth")}
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Aadhaar Number
                </Label>
                <Input
                  {...register("aadharNumber")}
                  placeholder="Enter Aadhaar number"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
              </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="space-y-12 border-t pt-14">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Upload Documents
              </h2>
              <p className="text-muted-foreground text-sm">
                Upload clear and readable documents.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PHOTO */}
              <div className="rounded-3xl border bg-muted/20 p-8 space-y-8 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Passport Photo
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      JPG or PNG
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  className="h-12 rounded-xl cursor-pointer file:mr-4 file:px-4 file:py-2 mt-2"
                />
              </div>

              {/* SIGNATURE */}
              <div className="rounded-3xl border bg-muted/20 p-8 space-y-8 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Signature
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Clear signature image
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  className="h-12 rounded-xl cursor-pointer file:mr-4 file:px-4 file:py-2 mt-2"
                />
              </div>

              {/* AADHAAR */}
              <div className="rounded-3xl border bg-muted/20 p-8 space-y-8 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Aadhaar Document
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      PDF or image
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  className="h-12 rounded-xl cursor-pointer file:mr-4 file:px-4 file:py-2 mt-2"
                />
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div className="border-t pt-12 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="font-semibold text-xl">
                Save your application
              </p>
              <p className="text-sm text-muted-foreground">
                Verify all details before continuing to payment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-13 px-8 rounded-2xl text-[15px] font-medium"
              >
                Save Draft
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="h-13 px-10 rounded-2xl min-w-[220px] text-[15px] font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </div>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}