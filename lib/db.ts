import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function connectToDatabase(): Promise<void> {
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGODB_URL || "", {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
    });

    connection.isConnected = db.connections[0].readyState;
}

export default connectToDatabase;