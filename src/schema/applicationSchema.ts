import { z } from "zod";

export const applicationSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  address: z.string().min(5, "Address is required"),

  district: z.string().min(2, "District is required"),

  pinCode: z
    .string()
    .min(6, "PIN must be 6 digits")
    .max(6)
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  gender: z.enum(["male", "female", "other"]),

  dateOfBirth: z.string().min(1, "DOB is required"),

  aadharNumber: z
    .string()
    .length(12, "Aadhar must be 12 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  photoUrl: z.string().url("Photo is required"),

  signatureUrl: z.string().url("Signature is required"),

  aadharDocumentUrl: z.string().url("Aadhar document is required"),
});

export type ApplicationFormType = z.infer<typeof applicationSchema>;