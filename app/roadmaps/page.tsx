"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Map, CheckCircle2, Circle, GitBranch } from 'lucide-react';

const PATHS = [
  { id: 'frontend', title: 'Frontend Mastery', description: 'HTML, CSS, JS, React, and Core Web Vitals', progress: 45, locked: false },
  { id: 'backend', title: 'Backend Engineering', description: 'Node.js, Databases, APIs, and Architecture', progress: 10, locked: false },
  { id: 'fullstack', title: 'Full Stack Architecture', description: 'Combining it all into scalable systems', progress: 0, locked: true },
  { id: 'systems', title: 'Systems Programming', description: 'C, C++, Rust, and low-level performance', progress: 0, locked: true },
]

export default function Roadmaps() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-4 flex items-center gap-4">
            <Map className="text-gold-500" size={36} /> Career Roadmaps
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">Structured learning paths to guide you from beginner to senior engineer. Complete the prerequisites to unlock advanced roadmaps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PATHS.map((path, i) => (
            <motion.div 
              key={path.id}
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{delay: i * 0.1}}
              className={`glass rounded-2xl p-6 border ${path.locked ? 'border-white/5 opacity-50' : 'border-gold-500/20 hover:border-gold-500/50'} transition-colors relative overflow-hidden`}
            >
              {path.locked && (
                <div className="absolute top-4 right-4 text-gray-600">
                  <CheckCircle2 size={24} />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${path.locked ? 'bg-white/5' : 'bg-gold-500/10'}`}>
                <GitBranch size={24} className={path.locked ? 'text-gray-600' : 'text-gold-500'} />
              </div>
              <h3 className="text-xl font-bold mb-2">{path.title}</h3>
              <p className="text-sm text-gray-400 mb-6">{path.description}</p>
              
              {!path.locked && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-gold-400 font-mono">{path.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full" style={{ width: `${path.progress}%` }}></div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-sm transition-colors">
                    Continue Path
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
