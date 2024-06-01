import mongoose from "mongoose";

export const mongoConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_STRING, { dbName: "SocketChatApp" })
      .then(() => {
        console.log("Connected to db");
      });
  } catch (error) {
    console.log(error.message);
  }
};