"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Rocket, GitBranch, Lock } from 'lucide-react';

const PATHS = [
  { id: 'frontend', title: 'Frontend Engineering', description: 'Master React, Next.js, and Modern CSS UI design.', locked: false, progress: 45 },
  { id: 'backend', title: 'Backend Engineering', description: 'Build scalable APIs with Node.js, databases, and microservices.', locked: false, progress: 10 },
  { id: 'fullstack', title: 'Full Stack Architecture', description: 'Combine Frontend and Backend into complete enterprise apps.', locked: true, progress: 0 },
  { id: 'mobile', title: 'Mobile Development', description: 'Build cross-platform mobile apps with React Native or Capacitor.', locked: true, progress: 0 },
  { id: 'devops', title: 'DevOps & Cloud', description: 'Deploy, scale, and manage infrastructure on AWS and GCP.', locked: true, progress: 0 },
];

export default function Roadmaps() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="text-4xl font-display font-bold mb-4">Developer Roadmaps</h1>
        <p className="text-gray-400 mb-12 max-w-2xl text-lg">Follow structured learning paths designed by industry experts. Validate your skills and earn certificates upon completion.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Lock size={20} />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${path.locked ? 'bg-white/5' : 'bg-gold-500/10'}`}>
                <GitBranch size={24} className={path.locked ? 'text-gray-600' : 'text-gold-500'} />
              </div>
              <h3 className="text-xl font-bold mb-2">{path.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{path.description}</p>
              
              {!path.locked && (
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400 font-medium">Progress</span>
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
