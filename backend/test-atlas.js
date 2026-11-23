require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
    tls: true,
    authMechanism: "SCRAM-SHA-256",
    authSource: "admin",
    serverSelectionTimeoutMS: 10000
});

async function test() {
    try {
        console.log("Connecting to MongoDB Atlas...");

        await client.connect();

        console.log("CONNECTED SUCCESSFULLY!");

        const db = client.db(process.env.MONGO_DB_NAME || "smart_medicine");

        const result = await db.command({ ping: 1 });

        console.log("MongoDB ping:", result);
    } catch (error) {
        console.error("MONGODB ERROR:");
        console.error(error);
    } finally {
        await client.close();
    }
}

test();