import {NextResponse} from "next/server";
import {db} from "@/lib/db"
import bcrypt from "bcryptjs";
export async function POST(req:Request) {
    try{
        const {email,password,name} = await req.json();
        if(!email || !password || !name){
            return NextResponse.json({status:400,error:"No valid creds"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db`INSERT INTO USERS(EMAIL,NAME,PASSWORD) VALUES(${email},${name},${hashedPassword})`
        return NextResponse.json({status:200,message:"signup success"})

    }catch(e){
        console.log(e);
        return NextResponse.json({status:500,error:"Internal server error"})
    }
}