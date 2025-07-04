import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                login: { label: "Login", type: "text", placeholder: "Login" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if(!credentials?.login || !credentials?.password) {
                    throw new Error("Username or password is not specified");
                    }

                    const existingUser = await db.user.findUnique({
                    where: { login: credentials.login }
                    });
                    
                    if(!existingUser) {
                    throw new Error("The user was not found");
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.password);

                    if (!passwordMatch) {
                    throw new Error("Invalid password");
                    }

                    return {
                        id: existingUser.id.toString(),
                        login: existingUser.login
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log(token);
            if (user) {
                return {
                    ...token,
                    login: user.login
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    login: token.login
                }
            }
        }
    }
}

export default NextAuth(authOptions)