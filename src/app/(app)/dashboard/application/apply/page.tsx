"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApplyPage() {
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const box =
    "w-full h-11 border rounded-md px-3 text-sm focus:ring-2 focus:ring-black";

  const onSubmit = async (data: any) => {
    setLoading(true);
    await axios.post("/api/application/apply", data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6">

      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div className="w-full">
          <Label>Name</Label>
          <Input
            value={session?.user?.name || ""}
            disabled
            className={box}
          />
        </div>

        <div className="w-full">
          <Label>Email</Label>
          <Input
            value={session?.user?.email || ""}
            disabled
            className={box}
          />
        </div>

      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div className="w-full">
          <Label>Phone</Label>
          <Input {...register("phone")} className={box} />
        </div>

        <div className="w-full">
          <Label>Gender</Label>
          <select {...register("gender")} className={box}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

      </div>

      {/* ADDRESS */}
      <div className="w-full">
        <Label>Address</Label>
        <Textarea {...register("address")} className="w-full min-h-[100px] border rounded-md p-3" />
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div className="w-full">
          <Label>District</Label>
          <Input {...register("district")} className={box} />
        </div>

        <div className="w-full">
          <Label>PIN Code</Label>
          <Input {...register("pinCode")} className={box} />
        </div>

      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div className="w-full">
          <Label>DOB</Label>
          <Input type="date" {...register("dateOfBirth")} className={box} />
        </div>

        <div className="w-full">
          <Label>Aadhar</Label>
          <Input {...register("aadharNumber")} className={box} />
        </div>

      </div>

      {/* FILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

        <div className="w-full">
          <Label>Photo</Label>
          <Input type="file" />
        </div>

        <div className="w-full">
          <Label>Signature</Label>
          <Input type="file" />
        </div>

        <div className="w-full">
          <Label>Aadhar</Label>
          <Input type="file" />
        </div>

      </div>

      {/* BUTTON */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit(onSubmit)} className="px-6 h-10">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>

    </div>
  );
}