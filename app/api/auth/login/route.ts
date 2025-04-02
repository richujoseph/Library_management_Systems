import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "No valid credentials" }, { status: 400 });
        }

        const rows = await db`SELECT id, email, password FROM USERS WHERE EMAIL=${email}`;
        if (rows.length === 0) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const user = rows[0];

        if (!user.password) {
            return NextResponse.json({ error: "Password not found in database" }, { status: 500 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!SECRET_KEY) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        console.log("Generated Token:", token);

        return NextResponse.json(
            { message: "Login success", userId: user.id, token },
            { status: 200 }
        );

    } catch (e) {
        console.error("Server Error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
