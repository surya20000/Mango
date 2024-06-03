import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

export const mongoConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_STRING || "mock_key", { dbName: "SocketChatApp" })
      .then(() => {
        console.log("Connected to db");
      });
  } catch (error) {
    console.log(error.message);
  }
};

console.log(process.env.MONGO_STRING);