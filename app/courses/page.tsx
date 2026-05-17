"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Layers, Terminal, Server, Smartphone, Monitor, Database } from 'lucide-react';

const CATEGORIES = [
  { id: 'frontend', name: 'Frontend Engineering', icon: <Layers className="w-6 h-6 text-blue-400" /> },
  { id: 'backend', name: 'Backend & APIs', icon: <Server className="w-6 h-6 text-green-400" /> },
  { id: 'mobile', name: 'Mobile App Development', icon: <Smartphone className="w-6 h-6 text-purple-400" /> },
  { id: 'desktop', name: 'Desktop Software', icon: <Monitor className="w-6 h-6 text-pink-400" /> },
  { id: 'databases', name: 'Databases & Cloud', icon: <Database className="w-6 h-6 text-yellow-400" /> },
  { id: 'languages', name: 'Programming Languages', icon: <Terminal className="w-6 h-6 text-orange-400" /> },
];

const COURSES = [
  { id: 'react-mastery', title: 'React 19 & Next.js 15 Mastery', category: 'frontend', level: 'Advanced', modules: 42, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/20' },
  { id: 'node-architecture', title: 'Node.js Microservices', category: 'backend', level: 'Intermediate', modules: 36, color: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/20' },
  { id: 'react-native', title: 'Production React Native', category: 'mobile', level: 'Intermediate', modules: 28, color: 'from-purple-500/20 to-fuchsia-500/10', border: 'border-purple-500/20' },
  { id: 'rust-systems', title: 'Rust Systems Programming', category: 'languages', level: 'Advanced', modules: 55, color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/20' },
  { id: 'firebase-scale', title: 'Scaling Firebase & NoSQL', category: 'databases', level: 'Beginner', modules: 18, color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/20' },
  { id: 'python-ai', title: 'Python for AI & Data', category: 'languages', level: 'All Levels', modules: 48, color: 'from-blue-500/20 to-yellow-500/10', border: 'border-blue-500/20' },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto w-full">
      <header className="mb-16">
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight">Curriculum <span className="text-gold-500">&</span> Paths</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Choose your learning path. From completely beginner to massive-scale systems engineering.
        </p>
      </header>

      <section className="mb-20">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(c => (
            <div key={c.id} className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 cursor-pointer transition-colors border border-white/5 hover:border-gold-500/30">
              {c.icon}
              <span className="font-medium text-sm">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-display font-semibold">Featured Courses</h2>
          <button className="text-sm text-gold-500 hover:text-gold-400">View All →</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={course.id} 
              className={`rounded-3xl p-6 border ${course.border} bg-gradient-to-br ${course.color} relative overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 backdrop-blur-3xl -z-10"></div>
              
              <div className="flex justify-between items-start mb-12">
                <span className="px-3 py-1 rounded-full bg-black/40 text-xs font-semibold uppercase tracking-wider text-white/70">
                  {course.category}
                </span>
                <span className="text-white/50 text-sm font-mono">{course.modules} modules</span>
              </div>
              
              <h3 className="text-2xl font-bold font-display mb-2 group-hover:text-gold-300 transition-colors">{course.title}</h3>
              <p className="text-sm text-gray-300">Level: <span className="font-medium text-white">{course.level}</span></p>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-medium">Start Learning</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
              <Link href={`/courses/${course.id}`} className="absolute inset-0 z-10 opacity-0">Start {course.title}</Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
