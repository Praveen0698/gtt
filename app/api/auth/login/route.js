import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../utils/auth";
export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  const { username, password } = await req.json();
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const res = NextResponse.json(
      { message: "Login successful", accessToken },
      { status: 200 }
    );

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
