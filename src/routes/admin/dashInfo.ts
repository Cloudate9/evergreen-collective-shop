import clientPromise from "$lib/mongoDB";
import dotenv from "dotenv";
import { isAuthorized } from "./authCheck";
import type { RequestHandler } from "@sveltejs/kit";
import type ItemStock from "$lib/ItemStock";
import type { Purchase } from "$lib/Purchase";

dotenv.config();

export const get: RequestHandler = async ({ request }) => {

    const isAuthenticated = isAuthorized(request.headers.get("cookie")?.split(";"));

    if (isAuthenticated) {

        const dbConnection = await clientPromise;
        const db = dbConnection.db(process.env["DB_NAME"]);
        const stockCollection = db.collection(process.env["DB_STOCK_COLLECTION"] as string);
        const items = await stockCollection.find({}).toArray() as ItemStock[];

        const purchaseCollection = db.collection(process.env["DB_PURCHASE_COLLECTION"] as string);
        const needsContacting = await purchaseCollection.find({ contacted: false, pickupArranged: false }).toArray() as unknown as Purchase[];
        const contacted = await purchaseCollection.find({ contacted: true, pickupArranged: false }).toArray() as unknown as Purchase[];
        const pickupArranged = await purchaseCollection.find({ contacted: true, pickupArranged: true }).toArray() as unknown as Purchase[];

        return {
            status: 200,
            body: {
                isAuthenticated: isAuthenticated,
                items: items,
                needsContacting: needsContacting,
                contacted: contacted,
                pickupArranged: pickupArranged
            }
        }
    }
    return {
        status: 200,
        body: {
            isAuthenticated: isAuthenticated,
        }
    }
}