import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


function generateApplicationNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);


        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const body = await req.json();
        const {
            phone,
            address,
            district,
            pinCode,
            gender,
            dateOfBirth,
            aadharNumber,
            photoUrl,
            signatureUrl,
            aadharDocumentUrl,
        } = body;

        if (!phone || !address || !district || !pinCode) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }


        const existing = await ApplicationModel.findOne({ userId });

        if (existing) {
            return NextResponse.json(
                { message: "Application already submitted" },
                { status: 409 }
            );
        }

   
        let applicationNumber = generateApplicationNumber();

        // ensure uniqueness
        let exists = await ApplicationModel.findOne({ applicationNumber });

        while (exists) {
            applicationNumber = generateApplicationNumber();
            exists = await ApplicationModel.findOne({ applicationNumber });
        }


        const fullName = session.user.name;
        const email = session.user.email;


        const application = await ApplicationModel.create({
            userId,
            applicationNumber,

            fullName,
            email,

            phone,
            address,
            district,
            pinCode,

            gender,
            dateOfBirth,
            aadharNumber,

            photoUrl,
            signatureUrl,
            aadharDocumentUrl,

            status: "pending",
            isRenewal: false,
        });

        return NextResponse.json(
            {
                message: "Application submitted successfully",
                application,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("APPLICATION_ERROR:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}