import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: "MongoDB connected!" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}
