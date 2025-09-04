"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube, FaInstagram, FaFilePdf } from "react-icons/fa";

interface Mydetail {
  _id?: string;
  cvLink?: string;
  youtubeLink?: string;
  facebookLink?:string;
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
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Mydetail from API
  const fetchMydetail = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mydetail");
      const data = await res.json();
      setMydetail(data);
    } catch (err) {
      console.error("Failed to fetch details");
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
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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

  const delayBase = isMobile ? 0.05 : 0.15;

  // Social media links configuration
  const socialLinks = [
    { 
      Icon: FaGithub, 
      href: mydetail.githubLink, 
      color: "hover:text-gray-900",
      enabled: isValidUrl(mydetail.githubLink),
      label: "GitHub"
    },
    { 
      Icon: FaYoutube, 
      href: mydetail.youtubeLink,
      color: "hover:text-red-600",
      enabled: isValidUrl(mydetail.youtubeLink),
      label: "YouTube"
    },
    { 
      Icon: FaLinkedinIn, 
      href: mydetail.linkedinLink, 
      color: "hover:text-blue-700",
      enabled: isValidUrl(mydetail.linkedinLink),
      label: "LinkedIn"
    },
    { 
      Icon: FaInstagram, 
      href: mydetail.instagramLink, 
      color: "hover:text-pink-600",
      enabled: isValidUrl(mydetail.instagramLink),
      label: "Instagram"
    },
    { 
      Icon: FaFacebookF, 
      href: mydetail.facebookLink, 
      color: "hover:text-blue-600",
      enabled: true,
      label: "Facebook"
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
    <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-24 py-12 md:py-24 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 overflow-hidden md:gap-15 sm:gap-15 pt-32 md:pt-24">

      {/* Left: Animated Circular Image */}
      <motion.div
        className="relative w-80 h-80 sm:w-120 sm:h-120 md:w-120 md:h-120 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl flex-shrink-0 z-10 md:mr-16"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: isMobile ? 0.5 : 0.8, type: "spring", stiffness: 120 }}
        whileHover={{ scale: 1.12, rotate: 5 }}
      >
        <Image
          src="/hero.jpg"
          alt="Manoj Bhatt"
          fill
          className="object-cover"
          priority
        />

        {/* Slogan */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-700 text-lg sm:text-xl font-semibold bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase + 0.25 }}
          whileHover={{ scale: 1.05 }}
        >
          Code‑Learn‑Innovate
        </motion.div>
      </motion.div>

      {/* Right: Content */}
      <motion.div
        className="flex-1 flex flex-col justify-center text-center md:text-left max-w-3xl mt-10 md:mt-0 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: isMobile ? 0.5 : 0.8 }}
      >
        <motion.p
          className="text-lg sm:text-xl font-bold text-yellow-800 mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          Hey 👋 I am
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-900 drop-shadow-lg mt-2 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase + 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <span className="text-yellow-500">Manoj Bhatt</span>
        </motion.h1>

        <motion.h2
          className="text-lg sm:text-2xl font-semibold text-yellow-800 mt-1 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase + 0.1 }}
          whileHover={{ scale: 1.02, y: -1 }}
        >
          Enthusiastic Learner, Digital Innovator & Web Designer
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg md: text-xl md:p-8 md:my-15 text-yellow-900 mb-8 max-w-xl bg-white/70 backdrop-blur-md px-6 py-6 rounded-2xl shadow-md"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase + 0.15 }}
          whileHover={{ scale: 1.02, x: 2 }}
        >
          Welcome to my personal space where innovation meets excellence. As a passionate creator of cutting-edge solutions and stunning web designs, I am dedicated to turning your digital vision into reality. Let's work together to craft impactful and beautiful solutions for your business.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delayBase + 0.25 }}
        >
          <motion.a
            href="/portfolio"
            className="px-6 py-3 bg-yellow-600 text-white rounded-full shadow hover:bg-yellow-700 transition flex items-center justify-center gap-2"
            whileHover={{ scale: 1.12, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href={formatUrl(mydetail.cvLink)}
            target={isValidUrl(mydetail.cvLink) ? "_blank" : "_self"}
            className={`px-6 py-3 bg-white text-yellow-600 border border-yellow-600 rounded-full hover:bg-yellow-50 transition flex items-center justify-center gap-2 ${
              !isValidUrl(mydetail.cvLink) ? "opacity-70 cursor-not-allowed" : ""
            }`}
            whileHover={isValidUrl(mydetail.cvLink) ? { scale: 1.12, rotate: 3 } : {}}
            whileTap={isValidUrl(mydetail.cvLink) ? { scale: 0.95 } : {}}
          >
            <FaFilePdf />
            Download CV
          </motion.a>
        </motion.div>

        {/* Find Me On */}
        <motion.div
          className="mt-12 flex flex-col items-center md:items-start gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delayBase + 0.3 }}
        >
          <p className="text-lg font-semibold text-yellow-800">Find me on</p>
          <div className="flex gap-6 flex-wrap justify-center md:justify-start">
            {socialLinks.map(({ Icon, href, color, enabled, label }, i) => (
              enabled ? (
                <motion.a
                  key={i}
                  href={formatUrl(href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl text-yellow-700 transition ${color} relative group`}
                  whileHover={{ scale: 1.3, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {label}
                  </span>
                </motion.a>
              ) : null
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}