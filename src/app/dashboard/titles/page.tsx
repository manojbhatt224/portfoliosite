"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Title {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TitlesPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [filteredTitles, setFilteredTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<Title | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Fetch titles with optional filtering
  const fetchTitles = async (search = "") => {
    try {
      search ? setSearchLoading(true) : setLoading(true);
      const url = search ? `/api/titles?name=${encodeURIComponent(search)}` : "/api/titles";
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Failed to fetch titles: ${response.statusText}`);

      const data = await response.json();
      if (search) setFilteredTitles(data);
      else {
        setTitles(data);
        setFilteredTitles(data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const debouncedFetchTitles = useCallback(
    debounce((search: string) => fetchTitles(search), 300),
    []
  );

  useEffect(() => {
    fetchTitles();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTitles(titles);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debouncedFetchTitles(searchTerm);
  }, [searchTerm, titles, debouncedFetchTitles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingTitle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Title name is required");
      return;
    }

    try {
      const url = `/api/titles`;
      const method = editingTitle ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTitle ? { id: editingTitle._id, ...formData } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingTitle ? "update" : "create"} title`);
      }

      const savedTitle = await response.json();
      const updatedTitles = editingTitle
        ? titles.map(title => (title._id === savedTitle._id ? savedTitle : title))
        : [savedTitle, ...titles];

      setTitles(updatedTitles);
      setFilteredTitles(searchTerm ? updatedTitles.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : updatedTitles);

      setIsModalOpen(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (title: Title) => {
    setEditingTitle(title);
    setFormData({ name: title.name, description: title.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this title? This will also delete all associated data.")) return;

    try {
      const response = await fetch(`/api/titles?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete title");

      const updatedTitles = titles.filter(title => title._id !== id);
      setTitles(updatedTitles);
      setFilteredTitles(updatedTitles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const displayTitles = searchTerm ? filteredTitles : titles;

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Titles Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search titles..."
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
          >
            Add New Title
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Status */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredTitles.length} result{filteredTitles.length !== 1 ? "s" : ""} for "{searchTerm}"
          <button
            onClick={() => setSearchTerm("")}
            className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Table */}
      {displayTitles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No titles found matching your search." : "No titles found. Create your first title!"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTitles.map((title) => (
                <tr key={title._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{title.name}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{title.description || "No description"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">{new Date(title.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(title)}
                      className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(title._id)}
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
              {editingTitle ? "Edit Title" : "Add New Title"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Name *</label>
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
                  {editingTitle ? "Update" : "Create"} Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
