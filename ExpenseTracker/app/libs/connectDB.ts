import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

export default async function connectDB() {
  return await mongoose
    .connect(MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("Connected Failed: ", err));
}
