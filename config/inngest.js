// src/inngest/client.ts
import { Inngest } from "inngest";
import { connectDb } from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

//inggest fnt to save user data to db
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDb()
        await User.create(userData)
    }
)

//inngest fnc to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDb()
        await User.findByIdAndUpdate(id, userData)
    }
)
//ingest funct to delete user from db
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        const {id} = event.data

        await connectDb()
        await User.findByIdAndDelete(id)
    }
)