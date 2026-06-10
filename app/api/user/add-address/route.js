import { getAuth } from "@clerk/nextjs/server";
import { connectDb } from "@/config/db";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address } = await request.json()

        await connectDb()
        const newAddress = await Address.create({ ...address, userId })

        return NextResponse.json({ success: true, message: "Address added Successfully", newAddress })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}