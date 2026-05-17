"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, Loader2, Code2, Database, Layout } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mock data for enterprise projects
const course = {
  id: 'react-mastery',
  title: 'React 19 & Next.js 15 Mastery',
  description: 'Build a production-grade enterprise dashboard. Learn server components, advanced routing, caching, and secure authentication.',
  overview: `
### The Enterprise Dashboard Project
You will build a complete, real-world data dashboard exactly like what tech companies use internally. 

#### What you will master:
- **React 19 Architecture:** Server Components, Actions, useTransitions
- **Next.js 15 App Router:** Advanced file-based routing and middleware
- **Data Layer:** Securely integrating Firebase & PostgreSQL
- **UI/UX Engineering:** Tailwind CSS, Framer Motion, and accessible components

#### Real-world Systems Included:
- Role-based Access Control (RBAC)
- Real-time Analytics Engine
- File Uploads & Cloud Storage
- Export to PDF / CSV
`,
  xpReward: 5000,
  modules: [
    { id: 'm1', title: 'System Architecture & Routing', icon: Layout, lessons: [
      { id: 'l1', title: 'App Router Basics & Layouts', duration: '12 min' },
      { id: 'l2', title: 'Server vs Client Boundaries', duration: '18 min' },
      { id: 'l3', title: 'Data Fetching Mastery', duration: '25 min' }
    ]},
    { id: 'm2', title: 'State Management & Mutations', icon: Code2, lessons: [
      { id: 'l4', title: 'React 19 use() Hook', duration: '15 min' },
      { id: 'l5', title: 'Server Actions for Form Submissions', duration: '22 min' },
    ]},
    { id: 'm3', title: 'Database Integration', icon: Database, lessons: [
      { id: 'l6', title: 'Setting up Firebase / Supabase', duration: '30 min' },
      { id: 'l7', title: 'Designing the Schema', duration: '20 min' },
    ]}
  ]
};

export default function CourseDetails({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(['l1']);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'overview'>('curriculum');

  let isNextUnlocked = true;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        
        <header className="mb-12 border-b border-white/10 pb-12">
          <div className="flex gap-4 items-center mb-6">
            <span className="px-3 py-1 rounded border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
              Enterprise Project
            </span>
            <span className="px-3 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs uppercase tracking-widest font-semibold">
              Advanced Level
            </span>
            <span className="text-sm font-mono text-gray-500">+ {course.xpReward} XP</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{course.title}</h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mb-8">
            {course.description}
          </p>

          <div className="flex gap-4 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('curriculum')}
              className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'curriculum' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Curriculum & Workspace
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              System Overview
            </button>
          </div>
        </header>

        {activeTab === 'overview' ? (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="prose prose-invert max-w-none glass p-8 rounded-2xl">
            <Markdown remarkPlugins={[remarkGfm]}>{course.overview}</Markdown>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {course.modules.map((mod, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={mod.id} 
                className="glass rounded-xl overflow-hidden border border-white/5"
              >
                <div className="p-6 bg-[#141414] border-b border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                    <mod.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Module {i + 1}</div>
                    <h3 className="text-xl font-bold">{mod.title}</h3>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-white/5 bg-[#0f0f0f]">
                  {mod.lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isUnlocked = isNextUnlocked;
                    if (!isCompleted) isNextUnlocked = false; 

                    return (
                      <div key={lesson.id} className="p-5 px-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          {isCompleted && <CheckCircle2 className="text-green-500" size={20} />}
                          {!isCompleted && isUnlocked && <PlayCircle className="text-gold-500" size={20} />}
                          {!isCompleted && !isUnlocked && <Lock className="text-gray-600" size={20} />}
                          <span className={`font-medium ${!isCompleted && !isUnlocked ? 'text-gray-600' : 'text-gray-200'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-mono text-gray-500">{lesson.duration}</span>
                          {isUnlocked || isCompleted ? (
                            <Link href={`/ide?courseId=${courseId}&lessonId=${lesson.id}`} className={`px-4 py-2 rounded font-semibold transition-all text-sm ${isCompleted ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gold-500 hover:bg-gold-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}>
                              {isCompleted ? 'Review Code' : 'Open IDE'}
                            </Link>
                          ) : (
                            <div className="px-4 py-2 rounded bg-white/5 text-gray-700 text-sm font-semibold cursor-not-allowed">
                              Locked
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
