import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/application";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const application = await Application.findOne({
    user: session.user.id,
  });

  return Response.json({
    success: true,
    application,
  });
}