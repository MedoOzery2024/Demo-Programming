"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Play, Code2, Award, Users, Search, FolderKanban, Map, Rocket, Trophy, Medal, Crown } from 'lucide-react';
import { useState } from 'react';

const COURSES = [
  { id: 'react-mastery', title: 'React 19 & Next.js 15 Mastery', level: 'Intermediate', xp: 5000, color: 'from-blue-500/20 to-cyan-500/5', icon: Code2 },
  { id: 'python-ai', title: 'Python AI Engineering', level: 'Advanced', xp: 8000, color: 'from-gold-500/20 to-yellow-500/5', icon: Rocket },
  { id: 'fullstack-firebase', title: 'Full-Stack Firebase', level: 'Beginner', xp: 3000, color: 'from-orange-500/20 to-red-500/5', icon: FolderKanban },
];

const ROADMAPS = [
  { title: 'Frontend Developer', progress: 45, total: 100 },
  { title: 'Backend Developer', progress: 10, total: 100 },
  { title: 'Full Stack Developer', progress: 0, total: 100 },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-gray-200">
      
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xl">D</div>
             <span className="font-display font-bold text-xl tracking-tight text-white">DevVerse</span>
           </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</div>
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gold-500/10 text-gold-400 font-medium">
             <Map size={18} /> Dashboard
          </Link>
          <Link href="/ide" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <Code2 size={18} /> IDE Workspace
          </Link>
          <Link href="/roadmaps" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <Rocket size={18} /> Roadmaps
          </Link>
          
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Community & Gamification</div>
          <Link href="/leaderboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <Trophy size={18} /> Leaderboard
          </Link>
          <Link href="/community" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <Users size={18} /> Community
          </Link>
          <Link href="/certificates" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <Award size={18} /> Certificates
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500/20 to-transparent border border-gold-500/20">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
               <Crown size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Mahmoud</div>
              <div className="text-xs text-gold-400 font-medium font-mono">Level 42</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-black to-black -z-10 pointer-events-none"></div>

        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search courses, projects, challenges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 font-mono text-sm">
               <Medal size={16} /> 12,450 XP
            </div>
            <button className="text-sm font-medium hover:text-white transition-colors">Admin</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 z-10">
          <div className="max-w-6xl mx-auto">
            
            <section className="mb-12 pt-8">
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="glass-gold rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10 md:w-2/3">
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Master Software Engineering</h1>
                  <p className="text-lg text-gray-300 mb-8 max-w-xl">
                    Build real-world applications in an offline-first PWA environment. Complete enterprise projects, earn XP, and become a top developer.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/ide" className="px-6 py-3 rounded-full bg-gold-500 text-black font-bold hover:bg-gold-400 transition-colors flex items-center gap-2">
                       <Code2 size={18} /> Enter IDE Workspace
                    </Link>
                    <button className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
                       View Roadmap
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Courses */}
              <section className="lg:col-span-2">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Project-Based Learning</h2>
                    <p className="text-sm text-gray-400">Real projects. Real databases. Real deployment.</p>
                  </div>
                  <button className="text-sm text-gold-400 hover:text-gold-300 font-medium">View All</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COURSES.map((course, i) => (
                    <motion.div 
                      key={course.id}
                      initial={{opacity:0, y:20}} 
                      animate={{opacity:1, y:0}} 
                      transition={{delay: 0.1 * i}}
                      className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group border border-white/5 hover:border-gold-500/30 cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6`}>
                        <course.icon size={24} className="text-white opacity-80" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                        <span className="px-2 py-0.5 rounded bg-white/10 uppercase tracking-widest text-[10px] font-bold">
                          {course.level}
                        </span>
                        <span className="font-mono flex items-center gap-1">
                          <Crown size={12} className="text-gold-500" /> {course.xp} XP
                        </span>
                      </div>
                      <Link href={`/courses/${course.id}`} className="flex items-center gap-2 text-sm font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        Start Project <Play size={14} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Roadmaps & Progress */}
              <section className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Active Roadmaps</h2>
                  <div className="glass rounded-2xl p-6 flex flex-col gap-6">
                    {ROADMAPS.map((rm, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-200">{rm.title}</span>
                          <span className="text-gray-500 font-mono">{rm.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{width: 0}}
                            animate={{width: `${rm.progress}%`}}
                            className="h-full bg-gold-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Daily Challenges</h2>
                  <div className="glass rounded-2xl p-6 border border-gold-500/20 bg-gold-500/5">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Rocket size={16} className="text-gold-500" /> API Architecture
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">Design a scalable REST API using Next.js Route Handlers and proper error handling.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                      Accept Challenge
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
