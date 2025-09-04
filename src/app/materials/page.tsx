"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Types
interface Chapter {
  _id: string;
  name: string;
  driveLink: string;
  description?: string;
  subjectId: {
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
  };
  createdAt: string;
}

interface Stats {
  totalChapters: number;
  totalSubjects: number;
  totalClasses: number;
  totalTitles: number;
}

interface Category {
  _id: string;
  name: string;
  classes: Class[];
}

interface Class {
  _id: string;
  name: string;
  subjects: Subject[];
}

interface Subject {
  _id: string;
  name: string;
  chapterCount: number;
}

// Statistics Card Component
function StatCard({ title, value, icon, description }: { 
  title: string; 
  value: number; 
  icon: string; 
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-4xl font-bold text-yellow-700 mb-2">{value}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// Category Card Component
function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-yellow-100 p-4 border-b border-yellow-200">
        <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
      </div>
      <div className="p-4">
        {category.classes.map((classItem) => (
          <div key={classItem._id} className="mb-6 last:mb-0">
            <h4 className="font-semibold text-lg mb-3 text-gray-800">{classItem.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classItem.subjects.map((subject) => (
                <Link 
                  key={subject._id} 
                  href={`/materials/subject/${subject._id}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-yellow-50 transition-colors border border-gray-100"
                >
                  <span className="text-gray-700">{subject.name}</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {subject.chapterCount} notes
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  const [stats, setStats] = useState<Stats>({
    totalChapters: 0,
    totalSubjects: 0,
    totalClasses: 0,
    totalTitles: 0
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch statistics and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/chapters');
      const statsData = await statsRes.json();
      
      if (!statsRes.ok) throw new Error(statsData.error || "Failed to fetch stats");
      
      const { stats: statsInfo } = statsData;
      setStats({
        totalChapters: statsInfo.totalChapters,
        totalSubjects: statsInfo.totalSubjects,
        totalClasses: statsInfo.totalClasses,
        totalTitles: statsInfo.totalTitles
      });
      
      // Fetch chapters to organize by category
      const chaptersRes = await fetch('/api/chapters');
      const chaptersData = await chaptersRes.json();
      
      if (!chaptersRes.ok) throw new Error(chaptersData.error || "Failed to fetch chapters");
      
      // Organize data by category > class > subject
      const organizedData: Record<string, Category> = {};
      
      chaptersData.data.forEach((chapter: Chapter) => {
        const title = chapter.subjectId.classId.title;
        const classItem = chapter.subjectId.classId;
        const subject = chapter.subjectId;
        
        // Initialize category if not exists
        if (!organizedData[title._id]) {
          organizedData[title._id] = {
            _id: title._id,
            name: title.name,
            classes: []
          };
        }
        
        // Initialize class if not exists in this category
        let classInCategory = organizedData[title._id].classes.find(c => c._id === classItem._id);
        if (!classInCategory) {
          classInCategory = {
            _id: classItem._id,
            name: classItem.name,
            subjects: []
          };
          organizedData[title._id].classes.push(classInCategory);
        }
        
        // Initialize subject if not exists in this class
        let subjectInClass = classInCategory.subjects.find(s => s._id === subject._id);
        if (!subjectInClass) {
          subjectInClass = {
            _id: subject._id,
            name: subject.name,
            chapterCount: 0
          };
          classInCategory.subjects.push(subjectInClass);
        }
        
        // Increment chapter count for this subject
        subjectInClass.chapterCount += 1;
      });
      
      // Convert to array and sort
      const categoriesArray = Object.values(organizedData).map(category => ({
        ...category,
        classes: category.classes.map(classItem => ({
          ...classItem,
          subjects: classItem.subjects.sort((a, b) => a.name.localeCompare(b.name))
        })).sort((a, b) => a.name.localeCompare(b.name))
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-14 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Study Notes & Educational Materials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of free study notes organized by program, class, and subject
          </p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-yellow-600">Home</Link>
          <span>›</span>
          <span className="text-gray-900">Study Materials</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Growing Collection
            </h2>
            <div className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Programs" value={stats.totalTitles} icon="📚" description='Educational Program and Courses' />
                  <StatCard title="Classes" value={stats.totalClasses} icon="🏫" description='Levels or Grades' />
                  <StatCard title="Subjects" value={stats.totalSubjects} icon="📖" description='Subjects Covered'/>
                  <StatCard title="Chapters" value={stats.totalChapters} icon="📝" description='Notes Available' />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse Study Materials
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Select a program to view available classes and subjects with study materials
            </p>
            
            {categories.length > 0 ? (
              <div className="space-y-6">
                {categories.map(category => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No study materials available yet.</p>
              </div>
            )}
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Study Notes Repository</h3>
              <p className="text-gray-400 mb-4">
                Providing {stats.totalChapters}+ free educational resources across {stats.totalSubjects}+ subjects 
                to help students succeed in their academic journey.
              </p>
              <div className="flex space-x-4 text-sm text-gray-400">
                <span>{stats.totalTitles} Programs</span>
                <span>•</span>
                <span>{stats.totalClasses} Classes</span>
                <span>•</span>
                <span>{stats.totalSubjects} Subjects</span>
                <span>•</span>
                <span>{stats.totalChapters} Notes</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/materials" className="text-gray-400 hover:text-white">Study Materials</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
     
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Study Notes Repository. All rights reserved. {stats.totalChapters}+ educational resources and growing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}