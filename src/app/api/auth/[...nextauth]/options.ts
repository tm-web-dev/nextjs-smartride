import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/lib/bcrypt";
import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import { Role } from "@/types/role";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" }, 
      },

      async authorize(credentials) {
  if (!credentials) return null;

  await dbConnect();

  const user = await Usermodel.findOne({
    email: credentials.email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("EMAIL_NOT_VERIFIED"); // ✅ IMPORTANT
  }

  const isPasswordCorrect = await comparePassword(
    credentials.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    isVerified: user.isVerified,
    role: user.role as Role,
  };
}
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Runs on login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.role = user.role as Role;
      }
      return token;
    },

    async session({ session, token }) {
      // Runs on every request
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};