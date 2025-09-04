"use client";

import { motion } from "framer-motion";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import Image from "next/image";

const experiences = [
  {
    role: "Computer Science Teacher (8-9-10)",
    company: "Pinnacle Scholars Academy, Kathmandu",
    duration: "Jul 2025 - Current",
    description: null,
    icon: <MdSchool className="text-blue-500" size={28} />,
    logo: "/experience/pinnacle.webp",
    technologies: [],
  },
  {
    role: "Computer Network Teacher-6th sem",
    company: "Aryan College of Engineering & Management, Kathmandu",
    duration: "2024 Spring",
    description: null,
    icon: <MdSchool className="text-blue-500" size={28} />,
    logo: "/experience/aryan.webp",
    technologies: [],
  },
  {
    role: "Associate Software Engineer",
    company: "Ramro Postal Service (Startup), USA",
    duration: "Jul 2024 - December 2024",
    description:
      "Worked on React.js and Node.js Express for a digital addressing system management.",
    icon: <FaReact className="text-blue-500" size={28} />,
    logo: "/experience/ramropostal.png",
    technologies: ["React.js", "Node.js", "Express", "TailwindCSS"],
  },
  {
    role: "Software Development Intern",
    company: "LIS Nepal Pvt. Ltd., Lalitpur",
    duration: "Oct 2023 - Jan 2024",
    description:
      "Explored Node.js Express and React. Implemented Captcha Service Integration Project. Worked with Python, Django, and Django REST Framework for internal AI projects. Fixed bugs, added features in frontend (React & Next.js), and gained experience in SQL, Data Warehousing, ETL, and Docker.",
    icon: <FaNodeJs className="text-green-500" size={28} />,
    logo: "/experience/lisnepal.png",
    technologies: ["Node.js", "React", "Django", "Next.js", "Docker", "SQL"],
  },
];

export default function Experience() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-20 px-6 md:px-20">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12"
      >
        My <span className="text-yellow-500">Experience</span>
      </motion.h2>

      {/* Timeline */}
      <div className="relative border-l-4 border-yellow-500 ml-4 md:ml-12 space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-lg rounded-2xl p-6 relative w-full md:w-[80%] hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Icon bubble */}
            <div className="absolute -left-10 top-6 bg-white border-4 border-yellow-500 rounded-full p-2">
              {exp.icon}
            </div>

            {/* Logo section */}
            <div className="flex-shrink-0 w-28 h-28 relative rounded-2xl overflow-hidden border-2 border-yellow-300 shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={exp.logo}
                alt={`${exp.company} logo`}
                fill
                className="object-contain p-2"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-slate-800">{exp.role}</h3>
              <p className="text-sm text-slate-500 mb-2">{exp.company}</p>
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                {exp.duration}
              </span>

              <p className="mt-4 text-slate-600 leading-relaxed hover:text-slate-800 transition-colors duration-300">
                {exp.description}
              </p>

              {/* Technologies Section */}
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="text-xs font-medium text-slate-800 bg-yellow-200 px-2 py-1 rounded-md hover:bg-yellow-300 transition-colors duration-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-slate-600 text-lg">
          Always <span className="font-semibold text-yellow-600">learning</span> and{" "}
          <span className="font-semibold text-green-600">building</span> for the future 🚀
        </p>
      </motion.div>
    </section>
  );
}
