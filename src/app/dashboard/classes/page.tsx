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
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    title: "",
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
      const response = await fetch('/api/titles');
      if (!response.ok) throw new Error('Failed to fetch titles');
      const data = await response.json();
      setTitles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch titles');
    }
  };

  const fetchClasses = async (filters: { titleId?: string; name?: string } = {}) => {
    try {
      setSearchLoading(true);

      const params = new URLSearchParams();
      if (filters.titleId) params.append('titleId', filters.titleId);
      if (filters.name) params.append('name', filters.name);

      const response = await fetch(`/api/classes?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch classes: ${response.statusText}`);

      const data = await response.json();
      setClasses(data);
      setFilteredClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const debouncedFetchClasses = useCallback(
    debounce((filters: { titleId?: string; name?: string }) => {
      fetchClasses(filters);
    }, 300),
    []
  );

  useEffect(() => {
    fetchTitles();
    fetchClasses();
  }, []);

  useEffect(() => {
    const filters: { titleId?: string; name?: string } = {};
    if (selectedTitle) filters.titleId = selectedTitle;
    if (searchTerm) filters.name = searchTerm;
    setSearchLoading(true);
    debouncedFetchClasses(filters);
  }, [searchTerm, selectedTitle, debouncedFetchClasses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: "", name: "", description: "" });
    setEditingClass(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.name.trim()) {
      setError("Title and class name are required");
      return;
    }

    try {
      const method = editingClass ? "PATCH" : "POST";
      const response = await fetch(`/api/classes`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClass
          ? { id: editingClass._id, name: formData.name, description: formData.description }
          : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingClass ? 'update' : 'create'} class`);
      }

      const savedClass = await response.json();
      const updatedClasses = editingClass
        ? classes.map(cls => (cls._id === savedClass._id ? savedClass : cls))
        : [savedClass, ...classes];

      setClasses(updatedClasses);
      setFilteredClasses(updatedClasses);
      setIsModalOpen(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title._id,
      name: cls.name,
      description: cls.description || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`/api/classes?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete class");

      const updatedClasses = classes.filter(cls => cls._id !== id);
      setClasses(updatedClasses);
      setFilteredClasses(updatedClasses);
      setError(null);
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
    <div className="max-w-6xl mx-auto px-3 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Classes Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:flex-initial">
            {/* Title Filter */}
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Titles</option>
              {titles.map(title => (
                <option key={title._id} value={title._id}>
                  {title.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
          >
            Add New Class
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter Status */}
      {(selectedTitle || searchTerm) && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredClasses.length} result{filteredClasses.length !== 1 ? "s" : ""}
          {selectedTitle && ` for "${titles.find(t => t._id === selectedTitle)?.name}"`}
          {searchTerm && ` matching "${searchTerm}"`}
          <button
            onClick={() => {
              setSelectedTitle("");
              setSearchTerm("");
            }}
            className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Classes Table */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {selectedTitle || searchTerm
              ? "No classes found matching your criteria."
              : "No classes found. Create your first class!"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map(cls => (
                <tr key={cls._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{cls.title.name}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{cls.name}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{cls.description || "No description"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{new Date(cls.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
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
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {editingClass ? "Edit Class" : "Add New Class"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  disabled={!!editingClass}
                >
                  <option value="">Select a Title</option>
                  {titles.map(title => (
                    <option key={title._id} value={title._id}>
                      {title.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
                >
                  {editingClass ? "Update" : "Create"} Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
