import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST (request) {
    try {
        const user = await request.json();
        const response = NextResponse.json({message: 'OK'}, {success: true});
        const token = jwt.sign(user, process.env.TOKEN_SECRET_KEY, {expiresIn: "1d"});
        response.cookies.set('uid', token, {httpOnly:true});
        return response;
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}