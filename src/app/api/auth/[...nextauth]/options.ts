import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/lib/bcrypt";
import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials) return null;

                await dbConnect();

                try {
                    const user = await Usermodel.findOne({
                        email: credentials.email,
                    });


                    if (!user) return null;


                    if (!user.isVerified) return null;


                    const isPasswordCorrect = await comparePassword(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) return null;


                    return {
                        id: user._id.toString(),
                        email: user.email,
                        isVerified: user.isVerified,
                    };

                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id?.toString(),
                    token.email = user.email,
                    token.isVerified = user.isVerified
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id,
                    session.user.email = token.email,
                    session.user.isVerified = token.isVerified
            }
            return session
        },

    },
    pages: {
        signIn: "/sign-in"
    },

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
