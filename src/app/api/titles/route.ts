import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";
import Title from "../../models/Title";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    
    let filter = {};
    if (name) {
      filter = { name: { $regex: name, $options: "i" } };
    }
    
    const titles = await Title.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(titles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch titles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, description } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existingTitle = await Title.findOne({ name });
    if (existingTitle) {
      return NextResponse.json({ error: "Title already exists" }, { status: 409 });
    }

    const title = await Title.create({ name, description });
    return NextResponse.json(title, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create title" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, description } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const title = await Title.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!title) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    return NextResponse.json(title);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update title" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const title = await Title.findByIdAndDelete(id);
    if (!title) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Title deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete title" }, { status: 500 });
  }
}