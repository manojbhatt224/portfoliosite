// app/portfolio/page.tsx

"use client";

import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
}

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description: "Personal portfolio built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "Tailwind", "Framer Motion"],
    image: "/projects/portfolio_and_note.png",
    github: "https://github.com/manojbhatt224/portfoliosite",
  },
  {
    title: "Event Management System",
    description: "Typically designed to be familiar with jotai state management.",
    technologies: ["Node js", "Express", "JSON File", "React", "Jotai"],
    image: "/projects/eventmanagement.png",
    github: "https://github.com/manojbhatt224/event_management",
  },
  {
    title: "Mobile Sales and Purchase Management System",
    description: "Tracks the purchase and sales history of any mobile shop with its stock level update.",
    technologies: ["MySQL", "Hibernate", "Java", "Spring Boot"],
    image: "/projects/mobilepurchasesale.png",
    github: "https://github.com/manojbhatt224/Mobile_Sales_and_Customer_Management_System",
  },
  {
    title: "Cafe Management System",
    description:
      "Desktop application that connects the kitchen department with counter and manages orders of the customers and generates bills.",
    technologies: ["SQL", "C#.NET"],
    image: "/projects/cafemanagement.jpeg",
    github: "https://github.com/manojbhatt224/CAFEMANAGEMENT",
  },
];

export default function PortfolioPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200 px-6 sm:px-12 lg:px-24 py-20 text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-yellow-900 drop-shadow-lg mb-4 py-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My <span className="text-yellow-500">Portfolio</span>
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 p-5">
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-yellow-500">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-500 hover:text-yellow-600 transition-colors duration-300 mt-4"
              >
                <FaGithub className="mr-2" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
