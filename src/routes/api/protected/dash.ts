import clientPromise from "$lib/mongoDB";
import dotenv from "dotenv";
import { isAuthorized } from "../public/authCheck";
import type { RequestHandler } from "@sveltejs/kit";
import type ItemStock from "$lib/ItemStock";
import { Purchase, PurchaseStatus } from "$lib/Purchase";

dotenv.config();

export const GET: RequestHandler = async ({ request }) => {

    const requestAuthCode = isAuthorized(request.headers.get("cookie")?.split(";"));

    if (requestAuthCode !== 200) {
        return {
            status: requestAuthCode,
            body: {
                isAuthorized: false,
            }
        }
    }

    const dbConnection = await clientPromise;
    const db = dbConnection.db(process.env["DB_NAME"]);
    const stockCollection = db.collection(process.env["DB_STOCK_COLLECTION"] as string);
    const items = await stockCollection.find({}).toArray() as ItemStock[];

    const purchaseCollection = db.collection(process.env["DB_PURCHASE_COLLECTION"] as string);
    const needsContacting = await purchaseCollection.find({ status: PurchaseStatus.NeedsContacting }).toArray() as unknown as Purchase[];
    const contacted = await purchaseCollection.find({ status: PurchaseStatus.Contacted }).toArray() as unknown as Purchase[];
    const pickupArranged = await purchaseCollection.find({ status: PurchaseStatus.PickupArranged }).toArray() as unknown as Purchase[];
    const completed = await purchaseCollection.find({ status: PurchaseStatus.Completed }).toArray() as unknown as Purchase[];

    return {
        status: 200,
        body: {
            isAuthorized: requestAuthCode === 200,
            items: items,
            needsContacting: needsContacting,
            contacted: contacted,
            pickupArranged: pickupArranged,
            completed: completed
        }
    }
}
