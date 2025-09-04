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
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    classId: "",
    name: "",
    description: ""
  });

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchTitles = async () => {
    try {
      const res = await fetch("/api/titles");
      if (!res.ok) throw new Error("Failed to fetch titles");
      const data = await res.json();
      setTitles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch titles");
    }
  };

  const fetchClasses = async (titleId?: string) => {
    try {
      const url = titleId ? `/api/classes?titleId=${titleId}` : "/api/classes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
      if (!titleId) setSelectedClass("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch classes");
    }
  };

  const fetchSubjects = async (filters: { classId?: string; name?: string } = {}) => {
    try {
      setSearchLoading(true);
      const params = new URLSearchParams();
      if (filters.classId) params.append("classId", filters.classId);
      if (filters.name) params.append("name", filters.name);

      const res = await fetch(`/api/subjects?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch subjects: ${res.statusText}`);
      const data = await res.json();
      setSubjects(data);
      setFilteredSubjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const debouncedFetchSubjects = useCallback(
    debounce((filters: { classId?: string; name?: string }) => {
      fetchSubjects(filters);
    }, 300),
    []
  );

  useEffect(() => {
    fetchTitles();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    selectedTitle ? fetchClasses(selectedTitle) : fetchClasses();
  }, [selectedTitle]);

  useEffect(() => {
    const filters: { classId?: string; name?: string } = {};
    if (selectedClass) filters.classId = selectedClass;
    if (searchTerm) filters.name = searchTerm;
    setSearchLoading(true);
    debouncedFetchSubjects(filters);
  }, [searchTerm, selectedClass, debouncedFetchSubjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ classId: "", name: "", description: "" });
    setEditingSubject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.name.trim()) {
      setError("Class and subject name are required");
      return;
    }

    try {
      const method = editingSubject ? "PATCH" : "POST";
      const res = await fetch(`/api/subjects`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSubject ? { id: editingSubject._id, ...formData } : formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${editingSubject ? "update" : "create"} subject`);
      }

      const savedSubject = await res.json();
      const updatedSubjects = editingSubject
        ? subjects.map(s => (s._id === savedSubject._id ? savedSubject : s))
        : [savedSubject, ...subjects];

      setSubjects(updatedSubjects);
      setFilteredSubjects(updatedSubjects);
      setIsModalOpen(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      classId: subject.classId._id,
      name: subject.name,
      description: subject.description || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? This will also delete all associated chapters.")) return;

    try {
      const res = await fetch(`/api/subjects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete subject");
      const updatedSubjects = subjects.filter(s => s._id !== id);
      setSubjects(updatedSubjects);
      setFilteredSubjects(updatedSubjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Subjects Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Titles</option>
              {titles.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={!selectedTitle && classes.length > 0}
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
          >
            Add New Subject
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No subjects found. {searchTerm || selectedTitle || selectedClass ? "Try adjusting filters." : "Create your first subject!"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Class", "Subject", "Description", "Created", "Actions"].map(h => (
                  <th key={h} className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubjects.map(subject => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">{subject.classId.title.name}</td>
                  <td className="px-4 sm:px-6 py-4">{subject.classId.name}</td>
                  <td className="px-4 sm:px-6 py-4">{subject.name}</td>
                  <td className="px-4 sm:px-6 py-4">{subject.description || "—"}</td>
                  <td className="px-4 sm:px-6 py-4">{new Date(subject.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleEdit(subject)} className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(subject._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">{editingSubject ? "Edit Subject" : "Add New Subject"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
                required
                disabled={!!editingSubject}
              >
                <option value="">Select Title</option>
                {titles.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>

              <select
                name="classId"
                value={formData.classId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
                required
                disabled={!!editingSubject || !selectedTitle}
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <input
                type="text"
                name="name"
                placeholder="Subject Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                    setSelectedTitle("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  {editingSubject ? "Update" : "Create"} Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
