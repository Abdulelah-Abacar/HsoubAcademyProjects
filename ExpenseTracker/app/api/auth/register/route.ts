import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import createToken from "@/app/libs/createToken";
import connectDB from "@/app/libs/connectDB";

interface Body {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
export default async function POST(req: NextRequest) {
  await connectDB();
  const { username, email, password, confirmPassword }: Body = await req.json();
  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Password does not match" },
      { status: 400 }
    );
  }

  // delete confirmPassword;

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashedPassword });
  const token = createToken(user._id.toString());

  return NextResponse.json({ user, token });
}
