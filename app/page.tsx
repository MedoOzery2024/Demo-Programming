"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Code2, Award, Users, Search, FolderKanban, Map, Rocket, Trophy, Medal, Crown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { COURSES, ROADMAPS } from '@/lib/data';
import { useAuth } from '@/components/AuthProvider';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signInWithGoogle, logout, xp, level, loading } = useAuth() as any;

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-500">Loading DevVerse...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-black to-black -z-10 pointer-events-none"></div>
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass-gold p-12 rounded-3xl max-w-md w-full text-center border border-gold-500/20">
          <Image src="/logo.png" alt="DevVerse Logo" width={80} height={80} className="mx-auto mb-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
          <h1 className="text-4xl font-display font-bold mb-4">DevVerse</h1>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">The ultimate programming ecosystem. Master code with project-based learning and an offline-first PWA environment.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.519-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-gray-200">
      
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
           <div className="flex items-center gap-3">
             <Image src="/logo.png" alt="DevVerse Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
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
        </nav>

        <div className="p-4 border-t border-white/5 group cursor-pointer relative" onClick={logout}>
          <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500/20 to-transparent border border-gold-500/20 group-hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 overflow-hidden">
                {user.photoURL ? <Image src={user.photoURL} alt={user.displayName || "User"} width={40} height={40} /> : <Crown size={20} />}
              </div>
              <div>
                <div className="text-sm font-bold text-white max-w-[100px] truncate">{user.displayName || "Developer"}</div>
                <div className="text-xs text-gold-400 font-medium font-mono group-hover:hidden delay-100">Level {level}</div>
                <div className="text-xs text-red-400 font-medium font-mono hidden group-hover:flex items-center gap-1"><LogOut size={12} /> Logout</div>
              </div>
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
               <Medal size={16} /> {xp.toLocaleString()} XP
            </div>
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
                    Welcome back, {user.displayName?.split(' ')[0] || 'Developer'}! Build real-world applications in an offline-first PWA environment. Complete enterprise projects, earn XP, and become a top developer.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/ide" className="px-6 py-3 rounded-full bg-gold-500 text-black font-bold hover:bg-gold-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                       <Code2 size={18} /> Open Workspace
                    </Link>
                    <Link href="/roadmaps" className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors hidden sm:flex items-center">
                       View Roadmap
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Courses */}
              <section className="lg:col-span-2">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Project-Based Curriculums</h2>
                    <p className="text-sm text-gray-400">Complete tutorials and realistic software projects.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COURSES.map((course, i) => (
                    <motion.div 
                      key={course.id}
                      initial={{opacity:0, y:20}} 
                      animate={{opacity:1, y:0}} 
                      transition={{delay: 0.05 * i}}
                      className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group border border-white/5 hover:border-gold-500/30 cursor-pointer h-full flex flex-col"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6`}>
                        <course.icon size={24} className="text-white opacity-80" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{course.overview}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 mt-auto">
                        <span className="px-2 py-0.5 rounded bg-white/10 uppercase tracking-widest text-[10px] font-bold">
                          {course.level}
                        </span>
                        <span className="font-mono flex items-center gap-1 text-xs">
                          <Crown size={12} className="text-gold-500" /> {course.xp}
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
                  <div className="glass rounded-2xl p-6 border border-gold-500/20 bg-gold-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-3xl rounded-full group-hover:bg-gold-500/20 transition-colors"></div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Rocket size={16} className="text-gold-500" /> API Architecture
                      </h4>
                      <p className="text-sm text-gray-400 mb-4">Design a scalable REST API using Next.js Route Handlers and proper error handling.</p>
                      <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                        Accept Challenge
                      </button>
                    </div>
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
