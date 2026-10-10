const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db_URL = process.env.MONGO_URI;

async function connectDB() {
try {
if (!db_URL) {
throw new Error("MONGO_URI is not defined in environment variables");
}

    await mongoose.connect(db_URL);

    console.log("MongoDB connected successfully!");

    return mongoose.connection;
} catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
}

}


module.exports = connectDB;
