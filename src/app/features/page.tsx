"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  SiBackendless,
  SiFrontendmentor,
} from "react-icons/si";
import { BsDatabaseCheck } from "react-icons/bs";
import { FaMobile } from "react-icons/fa";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { IoBookOutline } from "react-icons/io5";

// Features Data
export const featuresData = [
  {
    id: 1,
    icon: <SiFrontendmentor />,
    title: "Front End Development",
    des: "Building responsive frontends using React, Redux Toolkit, and Tailwind CSS with stunning UI/UX.",
  },
  {
    id: 2,
    icon: <SiBackendless />,
    title: "Back End Development",
    des: "Creating secure, scalable APIs with Node.js, Express, Django, and databases like MongoDB & SQL.",
  },
  {
    id: 3,
    icon: <IoBookOutline />,
    title: "Online/Part-time Teaching",
    des: "Knowledge sharing through mentorship, tutorials, and online teaching sessions.",
  },
  {
    id: 4,
    icon: <FaMobile />,
    title: "Mobile Development",
    des: "Cross-platform mobile apps using React Native with sleek UI and smooth performance.",
  },
  {
    id: 5,
    icon: <BsDatabaseCheck />,
    title: "Database Design",
    des: "Efficient database schemas with SQL & MongoDB ensuring scalability and performance.",
  },
  {
    id: 6,
    icon: <AiOutlineDeploymentUnit />,
    title: "Deployment Concepts",
    des: "Hands-on with CI/CD, Netlify, and cloud deployment to deliver production-ready apps.",
  },
];

// Fancy Card Component
const FeatureCard = ({ item, i }: { item: any; i: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  return (
    <motion.div
      className="relative group p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-yellow-300/50 shadow-lg hover:shadow-yellow-400/40 transition"
      style={{ rotateX, rotateY }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      onMouseMove={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300/30 via-yellow-200/20 to-yellow-400/10 blur-xl opacity-0 group-hover:opacity-100 transition"></div>

      {/* Icon */}
      <motion.div
        className="relative text-5xl text-yellow-700 mb-6"
        whileHover={{ scale: 1.2, rotate: 8 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {item.icon}
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-yellow-900 mb-3">{item.title}</h3>

      {/* Description */}
      <p className="text-yellow-800 text-base leading-relaxed">{item.des}</p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      className="relative min-h-screen py-24 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 px-6 md:px-12"
    >
      {/* Floating Blobs */}
      <motion.div
        className="absolute w-80 h-80 bg-yellow-300/40 rounded-full blur-3xl top-10 left-10 animate-pulse"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Heading */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-500 drop-shadow-md">
          Features
        </h1>
        <p className="text-lg text-yellow-700 mt-3">
          ✨ What I bring to the table
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-6xl w-full relative z-10">
        {featuresData.map((item, i) => (
          <FeatureCard item={item} i={i} key={item.id} />
        ))}
      </div>
    </section>
  );
};

export default Features;
