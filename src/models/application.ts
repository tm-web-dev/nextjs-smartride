import mongoose, { Schema, model, models, Document } from "mongoose";

export type ApplicationStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "expired";

export interface Application extends Document {
    userId: mongoose.Types.ObjectId;

    applicationNumber: string;

    // Snapshot of user data (at time of apply)
    fullName: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    pinCode: string;

    gender: "male" | "female" | "other";
    dateOfBirth: Date;

    // Sensitive + unique per application
    aadharNumber: string;

    // Uploads
    photoUrl: string;
    signatureUrl: string;
    aadharDocumentUrl: string;

    // Status & lifecycle
    status: ApplicationStatus;

    validFrom?: Date;
    validTill?: Date;

    isRenewal: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<Application>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        applicationNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Snapshot fields
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            match: [/^[0-9]{10}$/, "Invalid phone number"],
        },

        address: {
            type: String,
            required: true,
        },

        district: {
            type: String,
            required: true,
        },

        pinCode: {
            type: String,
            required: true,
            match: [/^[0-9]{6}$/, "Invalid PIN code"],
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        aadharNumber: {
            type: String,
            required: true,
            match: [/^[0-9]{12}$/, "Invalid Aadhar number"],
        },

        // Uploads
        photoUrl: {
            type: String,
            required: true,
        },

        signatureUrl: {
            type: String,
            required: true,
        },
        aadharDocumentUrl: {
            type: String,
            required: true,
        },

        // Status
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "expired"],
            default: "pending",
            index: true,
        },

        // Validity (after approval)
        validFrom: Date,
        validTill: Date,

        // Renewal tracking
        isRenewal: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ApplicationModel =
    (models.Application as mongoose.Model<Application>) ||
    model<Application>("Application", ApplicationSchema);

export default ApplicationModel;