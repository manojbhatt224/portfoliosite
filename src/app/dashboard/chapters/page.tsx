"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Title {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  title: Title;
  name: string;
}

interface Subject {
  _id: string;
  classId: Class;
  name: string;
}

interface Chapter {
  _id: string;
  subjectId: Subject;
  name: string;
  driveLink: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState({
    subjectId: "",
    name: "",
    driveLink: "",
    description: ""
  });

  // Fetch all titles for dropdown
  const fetchTitles = async () => {
    try {
      const response = await fetch('/api/titles');
      if (!response.ok) {
        throw new Error('Failed to fetch titles');
      }
      const data = await response.json();
      setTitles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch titles');
    }
  };

  // Fetch classes based on selected title
  const fetchClasses = async (titleId?: string) => {
    try {
      const url = titleId ? `/api/classes?titleId=${titleId}` : '/api/classes';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    }
  };

  // Fetch subjects based on selected class
  const fetchSubjects = async (classId?: string) => {
    try {
      const url = classId ? `/api/subjects?classId=${classId}` : '/api/subjects';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
    }
  };

  // Fetch all chapters
  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chapters');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.statusText}`);
      }
      
      const data = await response.json();
      setChapters(data.data);
      setFilteredChapters(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter chapters based on selected filters
  const filterChapters = useCallback(() => {
    setSearchLoading(true);
    
    let filtered = [...chapters];
    
    // Filter by title
    if (selectedTitle) {
      filtered = filtered.filter(chapter => 
        chapter.subjectId.classId.title._id === selectedTitle
      );
    }
    
    // Filter by class
    if (selectedClass) {
      filtered = filtered.filter(chapter => 
        chapter.subjectId.classId._id === selectedClass
      );
    }
    
    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(chapter => 
        chapter.subjectId._id === selectedSubject
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(chapter => 
        chapter.name.toLowerCase().includes(term) ||
        chapter.subjectId.name.toLowerCase().includes(term) ||
        chapter.subjectId.classId.name.toLowerCase().includes(term) ||
        chapter.subjectId.classId.title.name.toLowerCase().includes(term)
      );
    }
    
    setFilteredChapters(filtered);
    setSearchLoading(false);
  }, [chapters, selectedTitle, selectedClass, selectedSubject, searchTerm]);

  useEffect(() => {
    fetchTitles();
    fetchClasses();
    fetchSubjects();
    fetchChapters();
  }, []);

  useEffect(() => {
    if (selectedTitle) {
      fetchClasses(selectedTitle);
      setSelectedClass("");
      setSelectedSubject("");
    } else {
      fetchClasses();
    }
  }, [selectedTitle]);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
      setSelectedSubject("");
    } else {
      fetchSubjects();
    }
  }, [selectedClass]);

  useEffect(() => {
    filterChapters();
  }, [filterChapters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ subjectId: "", name: "", driveLink: "", description: "" });
    setEditingChapter(null);
    setSelectedTitle("");
    setSelectedClass("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjectId || !formData.name.trim() || !formData.driveLink.trim()) {
      setError("Subject, chapter name, and drive link are required");
      return;
    }

    try {
      const url = editingChapter ? `/api/chapters` : `/api/chapters`;
      const method = editingChapter ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingChapter ? { 
          id: editingChapter._id, 
          name: formData.name,
          driveLink: formData.driveLink,
          description: formData.description 
        } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingChapter ? 'update' : 'create'} chapter`);
      }

      const savedChapter = await response.json();
      
      if (editingChapter) {
        const updatedChapters = chapters.map(chapter => 
          chapter._id === savedChapter._id ? savedChapter : chapter
        );
        setChapters(updatedChapters);
      } else {
        setChapters(prev => [savedChapter, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
      setError(null);
      // Refresh the chapters list to get the updated data with populated fields
      fetchChapters();
    } catch (err: any) {
      if (err.message.includes("Google Drive link")) {
        setError("Please provide a valid Google Drive link");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({
      subjectId: chapter.subjectId._id,
      name: chapter.name,
      driveLink: chapter.driveLink,
      description: chapter.description || ""
    });
    
    // Set the title and class based on the subject for proper dropdown display
    setSelectedTitle(chapter.subjectId.classId.title._id);
    setSelectedClass(chapter.subjectId.classId._id);
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) {
      return;
    }

    try {
      const response = await fetch(`/api/chapters?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chapter");
      }

      setChapters(prev => prev.filter(chapter => chapter._id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const openDriveLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Header with Filters and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Chapters Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Title Filter */}
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Titles</option>
              {titles.map((title) => (
                <option key={title._id} value={title._id}>
                  {title.name}
                </option>
              ))}
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
              disabled={!selectedTitle}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
              disabled={!selectedClass}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                </div>
              )}
              {searchTerm && !searchLoading && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap text-sm sm:text-base"
          >
            Add New Chapter
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Filter Status */}
      {(selectedTitle || selectedClass || selectedSubject || searchTerm) && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''}
          {selectedTitle && ` for title "${titles.find(t => t._id === selectedTitle)?.name}"`}
          {selectedClass && ` in class "${classes.find(c => c._id === selectedClass)?.name}"`}
          {selectedSubject && ` in subject "${subjects.find(s => s._id === selectedSubject)?.name}"`}
          {searchTerm && ` matching "${searchTerm}"`}
          <button
            onClick={() => {
              setSelectedTitle("");
              setSelectedClass("");
              setSelectedSubject("");
              setSearchTerm("");
            }}
            className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Chapters Table */}
      {filteredChapters.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {selectedTitle || selectedClass || selectedSubject || searchTerm ? "No chapters found matching your criteria." : "No chapters found. Create your first chapter!"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chapter Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drive Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChapters.map((chapter) => (
                  <tr key={chapter._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chapter.subjectId.classId.title.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chapter.subjectId.classId.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chapter.subjectId.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chapter.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDriveLink(chapter.driveLink)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                        title="Open Google Drive Link"
                      >
                        View Notes
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(chapter.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="text-yellow-600 hover:text-yellow-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(chapter._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredChapters.map((chapter) => (
              <div key={chapter._id} className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{chapter.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(chapter)}
                      className="text-yellow-600 hover:text-yellow-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chapter._id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Title: </span>
                  <span className="text-sm text-gray-900">{chapter.subjectId.classId.title.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Class: </span>
                  <span className="text-sm text-gray-900">{chapter.subjectId.classId.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Subject: </span>
                  <span className="text-sm text-gray-900">{chapter.subjectId.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Created: </span>
                  <span className="text-sm text-gray-900">
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => openDriveLink(chapter.driveLink)}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  View Notes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingChapter ? "Edit Chapter" : "Add New Chapter"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                  disabled={!!editingChapter}
                >
                  <option value="">Select a Title</option>
                  {titles.map((title) => (
                    <option key={title._id} value={title._id}>
                      {title.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                  disabled={!!editingChapter || !selectedTitle}
                >
                  <option value="">Select a Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subjectId"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                  disabled={!!editingChapter || !selectedClass}
                >
                  <option value="">Select a Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Google Drive Link *
                </label>
                <input
                  type="url"
                  id="driveLink"
                  name="driveLink"
                  value={formData.driveLink}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be a valid Google Drive link</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 order-1 sm:order-2"
                >
                  {editingChapter ? "Update" : "Create"} Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}