"use client";

import React from "react";
import { motion } from "framer-motion";

const educationData = [
    {
    title: "BE Computer",
    institution: "National Academy of Science & Technology (NAST), Dhangadhi",
    year: "2023 AD",
    gpa: "3.66",
    description: `With aim to be a successful computer engineer, attended NAST, Dhangadhi, where I developed strong foundation in computer engineering,
developed programming & presentation skills, and led a team project to develop an innovative software solution addressing real-world issues.`,
    link: "https://nast.edu.np/",
    image: "/about/nast.jpeg",
  },
  {
    title: "ISC (Intermediate of Science)",
    institution: "Radiant Public Secondary School, Mahendranagar",
    year: "2018 AD",
    gpa: "3.34",
    description: `With aim to be in the field of engineering, attended Radiant Public Secondary School, Mahendranagar,
where I developed a strong foundation in core concepts of science branches. I was blessed with high quality of education from well experienced and gold medalist professors with great vision. Though, there was no computer subject as optional, I learnt great things from science.`,
    link: "https://radiantmnr.edu.np/",
    image: "/about/radiant.jpeg",
  },
  {
    title: "SLC (School Leaving Certificate)",
    institution: "Sunrise Secondary School, Mahendranagar",
    year: "2016 AD",
    gpa: "3.80",
    description: `Attended Sunrise Secondary School, Mahendranagar, where I developed a strong foundation in English speaking,
science and mathematics. Participated in various coding clubs and
competitions, including international COFAS (Computer Olympiad Fair & Seminar) organized by City Montessori School, Lucknow which fueled my interest in software development.
I express my gratitude to this school for providing me cooperative learning environment with self growth.`,
    link: "https://www.facebook.com/sunrisepublicacademy/",
    image: "/about/sunrise.jpg",
  },
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-16 px-6 md:px-20">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12 py-5"
      >
        About <span className="text-yellow-500">Me</span>
      </motion.h2>

      {/* Intro Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 mb-16"
      >
        <div className="lg:w-2/3 text-slate-700">
          <h3 className="text-3xl font-bold text-yellow-500 mb-4">
            My Passion for Software Development
          </h3>
          <p className="text-lg leading-relaxed">
            I've been passionate about software development from a young age.
            My interest towards computers started in grade 7 as a typist in my
            brother's photocopier shop. The thrill of solving complex problems
            and creating innovative solutions drives me. From playing with
            QBASIC and HTML in grade 10 to today, I love working with cutting-edge technologies and continuously improving my skills.
          </p>
        </div>
        <div className="lg:w-1/3 flex justify-center">
          <img
            src="/hero.jpg"
            alt="Coding"
            className="rounded-full border-4 border-yellow-500 shadow-lg w-60 h-60 object-cover"
            loading="lazy"
          />
        </div>
      </motion.div>
<h3 className="text-2xl font-bold text-yellow-500 mb-4">
            My Educational Journey
          </h3>
      {/* Education Timeline */}
      <div className="relative border-l-4 border-yellow-500 md:ml-10 space-y-12">
        {educationData.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-lg rounded-2xl p-6 relative w-full md:w-[80%] hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Image */}
            <div className="flex-shrink-0 w-28 h-28 relative rounded-2xl overflow-hidden border-2 border-yellow-300 shadow-md">
              <img
                src={edu.image}
                alt={edu.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-slate-800">{edu.title}</h3>
              <p className="text-sm text-slate-500 mb-2">{edu.institution}</p>
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                {edu.year} | GPA: {edu.gpa}
              </span>
              <p className="mt-4 text-slate-600 leading-relaxed hover:text-slate-800 transition-colors duration-300">
                {edu.description}
              </p>
              <a
                href={edu.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 underline mt-2 inline-block hover:text-yellow-500"
              >
                Click to see more
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
