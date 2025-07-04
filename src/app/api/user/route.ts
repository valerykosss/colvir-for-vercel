import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have at least 8 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { login, password } = userSchema.parse(body);

        const existingUserByLogin = await db.user.findUnique({
            where: { login }
        });
        
        if (existingUserByLogin) {
            return NextResponse.json(
                { user: null, message: "User with this login already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: { login, password: hashedPassword }
        });

        const userResponse: Omit<typeof newUser, 'password'> = {
            ...newUser
        };

        return NextResponse.json(
            { 
                user: userResponse, 
                message: "User created successfully" 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}