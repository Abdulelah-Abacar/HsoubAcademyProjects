import mongoose from "mongoose";

interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    email: {
      type: String,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
  },
  { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", userSchema);
