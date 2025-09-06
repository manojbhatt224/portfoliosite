"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Chapter {
  _id: string;
  name: string;
  driveLink: string;
  subjectId?: {
    name: string;
    classId?: {
      name: string;
      title?: {
        name: string;
      };
    };
  };
}

export default function ChapterView() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const getDrivePreviewLink = (url: string) => {
    try {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await fetch(`/api/chapters?chapterId=${chapterId}`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setChapter(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch chapter:", error);
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) fetchChapter();
  }, [chapterId]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading chapter...</div>;
  if (!chapter)
    return <div className="text-center py-10 text-red-500">Chapter not found</div>;

  const pdfUrl = getDrivePreviewLink(chapter.driveLink);

  return (
    <div className="w-full h-screen flex flex-col mt-14">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-100 to-slate-100 shadow-md p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
          {chapter.name}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700">
          {chapter.subjectId?.classId?.title?.name} -{" "}
          {chapter.subjectId?.classId?.name} - {chapter.subjectId?.name}
        </p>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
}
