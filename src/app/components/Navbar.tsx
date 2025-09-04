"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check login state
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Skills", path: "/skills" },
    { name: "Experience", path: "/experience" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Materials", path: "/materials" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.gif"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full object-cover border border-blue-400"
          />
          <h1 className="text-lg sm:text-xl font-bold text-yellow-600">
            Er. Manoj Bhatt
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <Link href={item.path} className="hover:text-blue-500 transition">
                {item.name}
              </Link>
            </motion.li>
          ))}

          {/* Dynamic Dashboard / Login / Logout */}
          {isLoggedIn ? (
            <>
              <motion.li
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <Link href="/dashboard" className="hover:text-blue-500 transition">
                  Dashboard
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </motion.li>
            </>
          ) : (
            <motion.li
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <Link href="/login" className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition">
                Login
              </Link>
            </motion.li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              open ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu with slide-in */}
      <AnimatePresence>
        {open && (
          <motion.ul
            className="md:hidden bg-white px-6 pb-4 space-y-4 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {menuItems.map((item) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <Link href={item.path} onClick={() => setOpen(false)}>
                  {item.name}
                </Link>
              </motion.li>
            ))}

            {/* Dynamic Mobile Login / Logout / Dashboard */}
            {isLoggedIn ? (
              <>
                <motion.li>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </motion.li>
                <motion.li>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition w-full text-left"
                  >
                    Logout
                  </button>
                </motion.li>
              </>
            ) : (
              <motion.li>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition w-full text-left"
                >
                  Login
                </Link>
              </motion.li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
