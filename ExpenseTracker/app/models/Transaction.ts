import mongoose from "mongoose";

interface ITransaction {
  _id: mongoose.Types.ObjectId;
  amount: number;
  name: string;
  userId: mongoose.Schema.Types.ObjectId;
  startDate: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    startDate: { type: Date, default: new Date() },
  },
  { timestamps: true }
);
export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
