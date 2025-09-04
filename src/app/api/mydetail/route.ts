import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "../../lib/db";
import Mydetail from "../../models/MyDetail";

export async function GET() {
  await dbConnect();
  const detail = await Mydetail.findOne();
  return NextResponse.json(detail || {});
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();

  let detail = await Mydetail.findOne();
  if (detail) {
    Object.assign(detail, data);
    await detail.save();
  } else {
    detail = await Mydetail.create(data);
  }

  return NextResponse.json(detail);
}
