"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaFilePdf,
  FaArrowRight,
} from "react-icons/fa";

interface Mydetail {
  _id?: string;
  cvLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  email?: string;
  contactNumber?: string;
  instagramLink?: string;
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [mydetail, setMydetail] = useState<Mydetail>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const fetchMydetail = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mydetail");
      const data: Mydetail = await res.json();
      setMydetail(data);
    } catch (err) {
      console.error("Failed to fetch details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMydetail();
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const formatUrl = (url?: string): string => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(formatUrl(url));
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const delayBase = isMobile ? 0.05 : 0.15;

  const socialLinks = [
    {
      Icon: FaGithub,
      href: mydetail.githubLink,
      color: "hover:text-gray-900",
      enabled: isValidUrl(mydetail.githubLink),
      label: "GitHub",
    },
    {
      Icon: FaYoutube,
      href: mydetail.youtubeLink,
      color: "hover:text-red-600",
      enabled: isValidUrl(mydetail.youtubeLink),
      label: "YouTube",
    },
    {
      Icon: FaLinkedinIn,
      href: mydetail.linkedinLink,
      color: "hover:text-blue-700",
      enabled: isValidUrl(mydetail.linkedinLink),
      label: "LinkedIn",
    },
    {
      Icon: FaInstagram,
      href: mydetail.instagramLink,
      color: "hover:text-pink-600",
      enabled: isValidUrl(mydetail.instagramLink),
      label: "Instagram",
    },
    {
      Icon: FaFacebookF,
      href: mydetail.facebookLink,
      color: "hover:text-blue-600",
      enabled: isValidUrl(mydetail.facebookLink),
      label: "Facebook",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-24 py-12 md:py-24 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 overflow-hidden pt-32 md:pt-24">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      </div>

      <div className="relative w-full max-w-7xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 z-10">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1 flex flex-col justify-center text-center md:text-left max-w-3xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: isMobile ? 0.5 : 0.8 }}
        >
          {/* Intro */}
          <motion.div
            className="inline-block mb-4 px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-2xl font-medium"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delayBase }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <span className="mr-2">👋</span> Hello, I'm
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-yellow-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 6, -4, 0],
              rotate: [0, -1, 1.5, -1, 0],
            }}
            transition={{
              delay: delayBase + 0.05,
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Manoj{" "}
            <motion.span
              className="text-yellow-600 inline-block"
              animate={{
                scale: [1, 1.05, 1],
                color: [
                  "#d97706",
                  "#f59e0b",
                  "#fbbf24",
                  "#f59e0b",
                  "#d97706",
                ],
              }}
              transition={{
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                color: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              Bhatt
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, 6, -5, 3, 0],
            }}
            transition={{
              delay: delayBase + 0.1,
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-yellow-800 inline-block relative px-4 py-2 rounded-lg">
              <span className="relative z-10">
                Digital Innovator & Web Designer
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-yellow-400 opacity-30 -z-0 rounded-full"
                animate={{
                  width: ["100%", "90%", "100%", "95%", "100%"],
                  opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.span>
            </h2>
          </motion.div>

{/* Description */}
<motion.div
  className="relative mb-10 max-w-xl mx-auto md:mx-0 my-10 group"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: delayBase + 0.15 }}
>
  {/* Decorative elements */}
  <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full opacity-70 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500"></div>
  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full opacity-70 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
  
  {/* Main paragraph container */}
  <motion.div
    className="relative bg-gradient-to-br from-white to-yellow-50/80 backdrop-blur-lg border-2 border-yellow-200/50 shadow-2xl shadow-yellow-200/30 rounded-2xl p-8 overflow-hidden"
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(234, 179, 8, 0.25)"
    }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNGRjAwIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjI4Ii8+PC9nPjwvc3ZnPg==')]"></div>
    </div>
    
    {/* Shine effect on hover */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-full top-0 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine"></div>
    </div>
    
    {/* Animated border */}
    <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 animate-pulse-slow"></div>
    </div>
    
    {/* Text content */}
    <motion.p 
      className="text-lg text-yellow-900 leading-relaxed relative z-10 font-medium text-justify"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delayBase + 0.25 }}
    >
      <span className="absolute -left-2 text-2xl text-yellow-500 font-serif">"</span>
      Welcome to my creative workshop where<span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent font-semibold">digital artistry meets technical precision</span>. As a passionate and dedicated craftsman of elegant web solutions and memorable digital experiences, I pour meticulous attention into every project, transforming concepts into beautifully functional realities that stand the test of time.
      <span className="absolute -right-2 bottom-0 text-2xl text-yellow-500 font-serif">"</span>
    </motion.p>
    
    {/* Signature effect */}
    <motion.div 
      className="flex justify-end mt-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delayBase + 0.35 }}
    >
      <div className="text-yellow-700 text-sm font-light italic border-t border-yellow-300/50 pt-1">
        Crafting digital excellence
      </div>
    </motion.div>
  </motion.div>
</motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delayBase + 0.25 }}
          >
            <motion.a
              href="/portfolio"
              className="px-8 py-4 bg-yellow-600 text-white rounded-full shadow-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2 group font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href={mydetail.cvLink ? formatUrl(mydetail.cvLink) : "#"}
              target={isValidUrl(mydetail.cvLink) ? "_blank" : "_self"}
              rel={isValidUrl(mydetail.cvLink) ? "noopener noreferrer" : ""}
              className={`px-8 py-4 bg-white text-yellow-600 border border-yellow-300 rounded-full hover:bg-yellow-50 transition flex items-center justify-center gap-2 font-medium shadow-lg ${
                !isValidUrl(mydetail.cvLink)
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              whileHover={
                isValidUrl(mydetail.cvLink) ? { scale: 1.05, y: -2 } : {}
              }
              whileTap={isValidUrl(mydetail.cvLink) ? { scale: 0.95 } : {}}
            >
              <FaFilePdf />
              Download CV
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delayBase + 0.3 }}
          >
            <p className="text-lg font-medium text-yellow-800">Find me on</p>
            <div className="flex gap-5 justify-center md:justify-start">
              {socialLinks.map(({ Icon, href, color, enabled, label }, i) =>
                enabled ? (
                  <motion.a
                    key={i}
                    href={formatUrl(href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-2xl p-3 bg-white text-yellow-700 rounded-full shadow-md transition-all duration-300 ${color} relative group`}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                  >
                    <Icon />
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {label}
                    </span>
                  </motion.a>
                ) : null
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Circular Image */}
        <motion.div
          className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden border-8 border-white shadow-2xl flex-shrink-0 z-10"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: isMobile ? 0.5 : 0.8,
            type: "spring",
            stiffness: 120,
          }}
          whileHover={{ scale: 1.03 }}
        >
          <Image
            src="/hero.jpg"
            alt="Manoj Bhatt"
            fill
            className="object-cover"
            priority
          />

          <motion.div
            className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <span className="text-2xl">🚀</span>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
          >
            <span className="text-2xl">💡</span>
          </motion.div>

          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-800 text-lg font-semibold bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delayBase + 0.25 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Code • Learn • Innovate
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
