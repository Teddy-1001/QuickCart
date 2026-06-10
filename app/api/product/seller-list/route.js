import { getAuth } from "@clerk/nextjs/server";
import { connectDb } from "@/config/db";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not Authorized' })
        }
        await connectDb()
        const products = await Product.find({})
        return NextResponse.json({ success: true, products })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}