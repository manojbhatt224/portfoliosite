"use client";

import React, { useEffect, useState } from "react";

interface Mydetail {
  _id?: string;
  cvLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  email?: string;
  facebookLink?:string;
  contactNumber?: string;
  instagramLink?: string;
}

export default function MydetailDashboard() {
  const [mydetail, setMydetail] = useState<Mydetail>({});
  const [formData, setFormData] = useState<Mydetail>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mydetail from API
  const fetchMydetail = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mydetail");
      const data = await res.json();
      setMydetail(data);
      setFormData(data);
    } catch (err) {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMydetail();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/mydetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMydetail(data);
      setFormData(data);
      setError(null);
    } catch (err) {
      setError("Failed to save details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Details</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <InputField
          label="CV Link"
          name="cvLink"
          value={formData.cvLink || ""}
          onChange={handleChange}
          placeholder="Google Drive CV link"
          disabled={saving}
        />
        <InputField
          label="YouTube Link"
          name="youtubeLink"
          value={formData.youtubeLink || ""}
          onChange={handleChange}
          placeholder="Your YouTube channel link"
          disabled={saving}
        />
        <InputField
          label="LinkedIn Link"
          name="linkedinLink"
          value={formData.linkedinLink || ""}
          onChange={handleChange}
          placeholder="LinkedIn profile link"
          disabled={saving}
        />
                <InputField
          label="Facebook Link"
          name="facebookLink"
          value={formData.facebookLink || ""}
          onChange={handleChange}
          placeholder="Facebook profile link"
          disabled={saving}
        />
        <InputField
          label="GitHub Link"
          name="githubLink"
          value={formData.githubLink || ""}
          onChange={handleChange}
          placeholder="GitHub profile link"
          disabled={saving}
        />
        <InputField
          label="Instagram Link"
          name="instagramLink"
          value={formData.instagramLink || ""}
          onChange={handleChange}
          placeholder="Instagram profile link"
          disabled={saving}
        />
        <InputField
          label="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Email address"
          type="email"
          disabled={saving}
        />
        <InputField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="Contact number"
          type="tel"
          disabled={saving}
        />

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
            saving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            "Save Details"
          )}
        </button>
      </form>
    </div>
  );
}

// Reusable Input Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
      }`}
    />
  </div>
);
