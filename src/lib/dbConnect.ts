import mongoose, { Connection } from "mongoose";


type ConnectionObject = {
    isconnected?: number,

}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void>{
    if (connection.isconnected){
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isconnected = db.connections[0].readyState
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }   

}

export default dbConnect;