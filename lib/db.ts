import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: Number
}

const connection: ConnectionObject = {}

async function connectToDatabase(): Promise<void> {
    if (connection.isConnected) {
        // console.log("Database is already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "", {})

        connection.isConnected = db.connections[0].readyState

        // console.log("DB connected successfully");

    } catch (error) {
        // console.log("DB connection failed", error);
        process.exit(1);
    }
}

export default connectToDatabase;