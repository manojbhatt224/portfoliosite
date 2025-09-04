"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TitlesPage from "./titles/page";
import ClassesPage from "./classes/page";
import SubjectsPage from "./subjects/page";
import ChaptersPage from "./chapters/page";
import MydetailDashboard from "./mydetail/page"; // Import your mydetail dashboard

interface Stats {
  titles: number;
  classes: number;
  subjects: number;
  chapters: number;
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState<
    "titles" | "classes" | "subjects" | "chapters" | "mydetail"
  >("titles");
  const [stats, setStats] = useState<Stats>({
    titles: 0,
    classes: 0,
    subjects: 0,
    chapters: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Login check
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
      fetchStats();
    }
  }, [router]);

  // Fetch statistics for the dashboard
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [titlesRes, classesRes, subjectsRes, chaptersRes] = await Promise.all([
        fetch("/api/titles"),
        fetch("/api/classes"),
        fetch("/api/subjects"),
        fetch("/api/chapters")
      ]);

      const titles = await titlesRes.json();
      const classes = await classesRes.json();
      const subjects = await subjectsRes.json();
      const chapters = await chaptersRes.json();

      setStats({
        titles: titles.length,
        classes: classes.length,
        subjects: subjects.length,
        chapters: chapters.data.length
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "titles":
        return <TitlesPage />;
      case "classes":
        return <ClassesPage />;
      case "subjects":
        return <SubjectsPage />;
      case "chapters":
        return <ChaptersPage />;
      case "mydetail":
        return <MydetailDashboard />; // Render Mydetail page
      default:
        return <TitlesPage />;
    }
  };

  const getButtonClass = (page: string) => {
    const baseClass =
      "px-4 py-2 rounded font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap";
    return activePage === page
      ? `${baseClass} bg-yellow-600 text-white shadow-md`
      : `${baseClass} bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900`;
  };

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{loading ? "..." : value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking login...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Study Notes Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Manage your educational content
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      {activePage === "titles" && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Titles" value={stats.titles} icon="📚" />
              <StatCard title="Classes" value={stats.classes} icon="🏫" />
              <StatCard title="Subjects" value={stats.subjects} icon="📖" />
              <StatCard title="Chapters" value={stats.chapters} icon="📝" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            {[
              { id: "titles", label: "Titles", icon: "📚" },
              { id: "classes", label: "Classes", icon: "🏫" },
              { id: "subjects", label: "Subjects", icon: "📖" },
              { id: "chapters", label: "Chapters", icon: "📝" },
              { id: "mydetail", label: "My Details", icon: "👤" } // New button for Mydetail
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id as any)}
                className={getButtonClass(page.id)}
                title={`Manage ${page.label}`}
              >
                <span>{page.icon}</span>
                <span>{page.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex py-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li className="flex items-center">
                <span className="text-gray-500">Dashboard</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="flex-shrink-0 h-4 w-4 text-gray-300 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-yellow-600">
                  {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{renderPage()}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Notes Management</h3>
              <p className="text-gray-400 text-sm">
                Organize your educational content efficiently
              </p>
            </div>
            <div className="flex space-x-6">
              <span className="text-gray-400 text-sm">
                Total: {stats.titles + stats.classes + stats.subjects + stats.chapters} items
              </span>
              <span className="text-gray-400 text-sm">© 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
