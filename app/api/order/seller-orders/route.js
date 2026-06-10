import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { connectDb } from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not Authorized' })
        }
        await connectDb()
        Address.length

        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}