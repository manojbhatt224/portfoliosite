'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface PopulatedSubject {
  _id: string;
  name: string;
  classId: {
    _id: string;
    name: string;
    title: {
      _id: string;
      name: string;
    };
  };
}

interface Chapter {
  _id: string;
  name: string;
  description?: string;
  driveLink: string;
  createdAt: string;
  subjectId: PopulatedSubject;
}

export default function SubjectPage() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/chapters?subjectId=${subjectId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch chapters');
      
      // Check for unique IDs to prevent duplicates
      const uniqueChapters = data.data.filter((chapter: Chapter, index: number, self: Chapter[]) => 
        index === self.findIndex((t) => t._id === chapter._id)
      );
      
      setChapters(uniqueChapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) fetchChapters();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchChapters}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const subjectDetails = chapters[0]?.subjectId;
  const classDetails = subjectDetails?.classId;
  const titleDetails = classDetails?.title;

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      {/* Artistic Header */}
      <header className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-md">
        <div className="absolute inset-0 bg-yellow-700 opacity-20 rounded-b-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-md">
            {subjectDetails?.name || 'Subject'}
          </h1>
          <p className="text-lg mt-2 opacity-90">
            {classDetails?.name ? `${classDetails.name} • ${titleDetails?.name}` : 'Learning Material'}
          </p>
          <p className="text-sm mt-2 max-w-2xl mx-auto opacity-80">
            Explore curated chapters for this subject and start your learning journey with high-quality notes.
          </p>
        </div>
      </header>

      {/* Chapters List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {chapters.length > 0 ? (
          <div className="space-y-4">
            {chapters.map(chapter => (
              <div
                key={chapter._id}
                className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-lg"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{chapter.name}</h2>
                  {chapter.description && (
                    <p className="text-gray-600 mt-1">{chapter.description}</p>
                  )}
                </div>
                <Link
                  href={`/materials/chapter/${chapter._id}`}
                  className="mt-3 md:mt-0 inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-md shadow"
                >
                  View Notes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No chapters available for this subject.</p>
        )}
      </main>
    </div>
  );
}