"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";

// Icons
import { IoLogoJavascript } from "react-icons/io";
import { AiOutlinePython, AiOutlineConsoleSql } from "react-icons/ai";
import { SiCplusplus, SiNodedotjs, SiExpress, SiDjango, SiMongoose } from "react-icons/si";
import { GrHtml5 } from "react-icons/gr";
import { TbBrandCss3, TbBrandMongodb } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssLine, RiBootstrapLine } from "react-icons/ri";

// Categories data
const categories = [
  {
    title: "Programming Languages",
    skills: [
      { name: "JavaScript", icon: <IoLogoJavascript className="text-yellow-400" /> },
      { name: "C/C++", icon: <SiCplusplus className="text-blue-400" /> },
      { name: "Python", icon: <AiOutlinePython className="text-green-400" /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: <SiNodedotjs className="text-green-500" /> },
      { name: "Express", icon: <SiExpress className="text-gray-300" /> },
      { name: "Django", icon: <SiDjango className="text-emerald-500" /> },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: <GrHtml5 className="text-orange-500" /> },
      { name: "CSS", icon: <TbBrandCss3 className="text-blue-500" /> },
      { name: "React", icon: <FaReact className="text-cyan-400" /> },
      { name: "TailwindCSS", icon: <RiTailwindCssLine className="text-sky-400" /> },
      { name: "Bootstrap", icon: <RiBootstrapLine className="text-purple-500" /> },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: <TbBrandMongodb className="text-green-500" /> },
      { name: "SQL", icon: <AiOutlineConsoleSql className="text-yellow-400" /> },
      { name: "Mongoose", icon: <SiMongoose className="text-red-400" /> },
    ],
  },
];

// Motion Variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.12, duration: 0.6, type: "spring" },
  }),
};

// Skill Card
const SkillCard: React.FC<{ icon: React.ReactNode; name: string; index: number }> = ({ icon, name, index }) => (
  <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05}>
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.08 }}
      className="flex flex-col items-center align-center justify-center p-6 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md 
      border border-yellow-400 hover:border-yellow-600 transition-all duration-300 max-w-[180px] w-full"
    >
      <div className="text-5xl mb-4 animate-pulse">{icon}</div>
      <p className="text-lg font-semibold text-yellow-900 text-center">{name}</p>
    </motion.div>
  </Tilt>
);

// Skill Page
const SkillPage: React.FC = () => {
  return (
    <section
      id="skills"
      className="min-h-screen bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200 py-20 px-6 flex flex-col items-center text-center"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-900 drop-shadow-lg mb-4">
          Skills <span className="text-yellow-500"> & Technologies </span>
        </h1>
        <p className="text-base md:text-xl text-yellow-800 max-w-2xl mx-auto">
          Technical Expertise & Creative Problem Solving
        </p>
      </motion.div>

      {/* Categories */}
      <div className="w-full flex flex-col items-center gap-16 ">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            className="w-full max-w-6xl text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-10 text-yellow-800 border-b-2 border-yellow-600 inline-block pb-2">
              {category.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {category.skills.map((skill, i) => (
                <SkillCard key={i} icon={skill.icon} name={skill.name} index={i} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillPage;
