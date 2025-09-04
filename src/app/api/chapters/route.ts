import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";
import Chapter from "../../models/Chapter";

function safeId(item?: any) {
  return item?._id?.toString() ?? null;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const name = searchParams.get("name");
    const chapterId=searchParams.get("chapterId")

    const filter: any = {};
    if (chapterId) filter._id = chapterId; // filter by chapter ID
    if (subjectId) filter.subjectId = subjectId;
    if (name) filter.name = { $regex: name, $options: "i" };

    const chapters = await Chapter.find(filter)
      .populate({
        path: "subjectId",
        select: "name classId",
        populate: {
          path: "classId",
          select: "name title",
          populate: { path: "title", select: "name" }
        }
      })
      .sort({ createdAt: -1 });

    // Compute statistics safely
    const uniqueSubjects = new Set(chapters.map(ch => safeId(ch.subjectId))).size;
    const uniqueClasses = new Set(chapters.map(ch => safeId(ch.subjectId?.classId))).size;
    const uniqueTitles = new Set(chapters.map(ch => safeId(ch.subjectId?.classId?.title))).size;

    return NextResponse.json({
      success: true,
      stats: {
        totalChapters: chapters.length,
        totalSubjects: uniqueSubjects,
        totalClasses: uniqueClasses,
        totalTitles: uniqueTitles
      },
      data: chapters
    });
  } catch (error) {
    console.error("GET /chapters error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch chapters" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { subjectId, name, driveLink, description } = await req.json();

    if (!subjectId || !name || !driveLink) {
      return NextResponse.json({ success: false, error: "Subject ID, name, and drive link are required" }, { status: 400 });
    }

    const existingChapter = await Chapter.findOne({ subjectId, name });
    if (existingChapter) {
      return NextResponse.json({ success: false, error: "Chapter already exists for this subject" }, { status: 409 });
    }

    const chapter = await Chapter.create({ subjectId, name, driveLink, description });
    await chapter.populate({
      path: "subjectId",
      select: "name classId",
      populate: {
        path: "classId",
        select: "name title",
        populate: { path: "title", select: "name" }
      }
    });

    return NextResponse.json({ success: true, data: chapter }, { status: 201 });
  } catch (error: any) {
    console.error("POST /chapters error:", error);
    return NextResponse.json({ success: false, error: "Failed to create chapter" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, name, driveLink, description } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Chapter ID is required" }, { status: 400 });
    }

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      { name, driveLink, description },
      { new: true, runValidators: true }
    ).populate({
      path: "subjectId",
      select: "name classId",
      populate: {
        path: "classId",
        select: "name title",
        populate: { path: "title", select: "name" }
      }
    });

    if (!chapter) {
      return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chapter });
  } catch (error: any) {
    console.error("PATCH /chapters error:", error);
    return NextResponse.json({ success: false, error: "Failed to update chapter" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Chapter ID is required" }, { status: 400 });
    }

    const chapter = await Chapter.findByIdAndDelete(id);
    if (!chapter) {
      return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("DELETE /chapters error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete chapter" }, { status: 500 });
  }
}
