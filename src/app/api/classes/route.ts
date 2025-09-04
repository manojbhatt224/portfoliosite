import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";
import Class from "../../models/Class";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const titleId = searchParams.get("titleId");
    const name = searchParams.get("name");
    
    let filter = {};
    if (titleId) filter = { ...filter, title: titleId };
    if (name) filter = { ...filter, name: { $regex: name, $options: "i" } };
    
    const classes = await Class.find(filter)
      .populate("title", "name")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { title, name, description } = await req.json();
    
    if (!title || !name) {
      return NextResponse.json({ error: "Title and name are required" }, { status: 400 });
    }

    const existingClass = await Class.findOne({ title, name });
    if (existingClass) {
      return NextResponse.json({ error: "Class already exists for this title" }, { status: 409 });
    }

    const newClass = await Class.create({ title, name, description });
    await newClass.populate("title", "name");
    
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, description } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    ).populate("title", "name");

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(updatedClass);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
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

    const classItem = await Class.findByIdAndDelete(id);
    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}