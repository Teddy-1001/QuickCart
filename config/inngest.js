import { Inngest } from "inngest";
import { connectDb } from "@/config/db";
import User from "@/models/User";
import Order from "@/models/Order";

export const inngest = new Inngest({ id: "quickcart-next" });

// CREATE USER
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: [{ event: "clerk/user.created" }],
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        await connectDb();

        await User.create({
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        });
    }
);

export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
        triggers: [{ event: "clerk/user.updated" }],
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        await connectDb();

        await User.findByIdAndUpdate(id, {
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        });
    }
);

export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-from-clerk",
        triggers: [{ event: "clerk/user.deleted" }],
    },
    async ({ event }) => {
        const { id } = event.data;

        await connectDb();
        await User.findByIdAndDelete(id);
    }
);

//inngest function to create user order in db
export const createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        },
        triggers: [{ event: "order/created" }]
    },
    async ({events}) => {
        const orders = events.map((event)=>{
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })
        await connectDb()
        await Order.insertMany(orders)

        return {success: true, processed: orders.length}
    }

)