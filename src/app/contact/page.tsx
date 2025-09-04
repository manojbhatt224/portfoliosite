"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Mydetail {
  _id?: string;
  cvLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  email?: string;
  contactNumber?: string;
  instagramLink?: string;
  facebookLink?: string;
}

interface ContactMethod {
  type: string;
  value: string;
  link: string;
  icon: string;
  enabled: boolean;
}

export default function ContactPage() {
  const [mydetail, setMydetail] = useState<Mydetail>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch Mydetail from API
  const fetchMydetail = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mydetail");
      const data = await res.json();
      setMydetail(data);
    } catch (err) {
      console.error("Failed to fetch contact details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMydetail();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSubmitStatus("idle");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus("success");
        setStatusMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        setStatusMessage(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStatus("error");
      setStatusMessage("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Function to ensure URLs are properly formatted
  const formatUrl = (url: string | undefined): string => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // Function to validate if a URL is properly formatted
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(formatUrl(url));
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Contact methods configuration
  const contactMethods: ContactMethod[] = [
    {
      type: "Email",
      value: mydetail.email || "manojbhatt224@gmail.com",
      link: `mailto:${mydetail.email || "manojbhatt224@gmail.com"}`,
      icon: "✉️",
      enabled: !!mydetail.email
    },
    {
      type: "YouTube",
      value: "Program Sphere",
      link: mydetail.youtubeLink || "https://www.youtube.com/@programsphere2081",
      icon: "🎥",
      enabled: isValidUrl(mydetail.youtubeLink)
    },
    {
      type: "LinkedIn",
      value: "linkedin.com/in/manojbhatt",
      link: mydetail.linkedinLink || "https://www.linkedin.com/in/manojbhatt",
      icon: "🔗",
      enabled: isValidUrl(mydetail.linkedinLink)
    },
    {
      type: "GitHub",
      value: "github.com/manojbhatt224",
      link: mydetail.githubLink || "https://github.com/manojbhatt224",
      icon: "🐱",
      enabled: isValidUrl(mydetail.githubLink)
    },
    {
      type: "Instagram",
      value: "Instagram",
      link: mydetail.instagramLink || "#",
      icon: "📸",
      enabled: isValidUrl(mydetail.instagramLink)
    },
    {
      type: "Facebook",
      value: "Facebook",
      link: mydetail.facebookLink || "#",
      icon: "👥",
      enabled: isValidUrl(mydetail.facebookLink)
    },
  ];

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-25 px-6 md:px-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-25 px-6 md:px-20 flex flex-col items-center">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12"
      >
        Contact <span className="text-yellow-500">Me</span>
      </motion.h2>

      {/* Contact Methods */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 w-full"
      >
        {contactMethods.map((method, index) => (
          method.enabled && (
            <motion.a
              key={index}
              href={method.link}
              target={method.link.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <h3 className="font-semibold text-slate-800">{method.type}</h3>
              <p className="text-sm text-slate-500 mt-1">{method.value}</p>
            </motion.a>
          )
        ))}
      </motion.div>

      {/* Status Message */}
      {submitStatus !== "idle" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full md:w-2/3 mb-6 p-4 rounded-lg text-center ${
            submitStatus === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage}
        </motion.div>
      )}

      {/* Contact Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full md:w-2/3 flex flex-col gap-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={sending}
          className="border border-yellow-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={sending}
          className="border border-yellow-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          disabled={sending}
          className="border border-yellow-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-300 disabled:bg-yellow-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </motion.form>
    </section>
  );
}