import mongoose from "mongoose";
import {DB_NAME} from "@/constants"

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return        
    }
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        connection.isConnected  = db.connections[0].readyState

        console.log("DB Connection Successfully");
        
    } catch (error) {
        console.log("DB connection failed");
        
        process.exit(1)
        
    }
}

export default dbConnect
