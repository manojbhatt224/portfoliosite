import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";
import { Chapter, Subject, Class, Title } from "../../models/index";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const name = searchParams.get("name");
    
    let filter = {};
    if (classId) filter = { ...filter, classId };
    if (name) filter = { ...filter, name: { $regex: name, $options: "i" } };
    
    const subjects = await Subject.find(filter)
      .populate({
        path: "classId",
        populate: { path: "title", select: "name" }
      })
      .sort({ createdAt: -1 });
      
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { classId, name, description } = await req.json();
    
    if (!classId || !name) {
      return NextResponse.json({ error: "Class ID and name are required" }, { status: 400 });
    }

    const existingSubject = await Subject.findOne({ classId, name });
    if (existingSubject) {
      return NextResponse.json({ error: "Subject already exists for this class" }, { status: 409 });
    }

    const subject = await Subject.create({ classId, name, description });
    await subject.populate({
      path: "classId",
      populate: { path: "title", select: "name" }
    });
    
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, description } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    ).populate({
      path: "classId",
      populate: { path: "title", select: "name" }
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
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

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}