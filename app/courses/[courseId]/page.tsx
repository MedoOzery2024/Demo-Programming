"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { use } from 'react';

export default function CourseDetails({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  // Mock data
  const course = {
    title: 'React 19 & Next.js 15 Mastery',
    description: 'Learn to build highly scalable, interactive web applications using the latest features of React 19 and the Next.js 15 App Router.',
    xpReward: 5000,
    modules: [
      { id: 'm1', title: 'Getting Started with Next.js 15', lessons: [
        { id: 'l1', title: 'Introduction to App Router', duration: '12 min', status: 'completed' },
        { id: 'l2', title: 'Server vs Client Components', duration: '18 min', status: 'unlocked' },
        { id: 'l3', title: 'Data Fetching Mastery', duration: '25 min', status: 'locked' }
      ]},
      { id: 'm2', title: 'Advanced React 19 Features', lessons: [
        { id: 'l4', title: 'The use() Hook', duration: '15 min', status: 'locked' },
        { id: 'l5', title: 'Actions & useTransition', duration: '22 min', status: 'locked' },
      ]}
    ]
  };

  return (
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto w-full pb-20">
      <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8">
        <ArrowLeft size={16} /> Back to Courses
      </Link>
      
      <header className="mb-12 border-b border-white/10 pb-12">
        <div className="flex gap-4 items-center mb-6">
          <span className="px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            Frontend
          </span>
          <span className="text-sm font-mono text-gray-500">+ {course.xpReward} XP</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{course.title}</h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
          {course.description}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-display font-semibold mb-4">Course Content</h2>
        
        {course.modules.map((mod, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={mod.id} 
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-6 bg-white/5 border-b border-white/5">
              <h3 className="text-xl font-medium tracking-tight">Module {i + 1}: {mod.title}</h3>
            </div>
            <div className="flex flex-col divide-y divide-white/5">
              {mod.lessons.map((lesson) => (
                <div key={lesson.id} className="p-4 px-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    {lesson.status === 'completed' && <CheckCircle2 className="text-green-500" size={20} />}
                    {lesson.status === 'unlocked' && <PlayCircle className="text-gold-500" size={20} />}
                    {lesson.status === 'locked' && <Lock className="text-gray-600" size={20} />}
                    <span className={`font-medium ${lesson.status === 'locked' ? 'text-gray-500' : 'text-gray-200'}`}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-mono text-gray-500">{lesson.duration}</span>
                    {lesson.status !== 'locked' ? (
                      <Link href={`/ide?lessonId=${lesson.id}`} className="px-4 py-2 rounded-full bg-white/10 hover:bg-gold-500 hover:text-black transition-all text-sm font-medium">
                        Start
                      </Link>
                    ) : (
                      <div className="px-4 py-2 rounded-full bg-white/5 text-gray-600 text-sm font-medium cursor-not-allowed">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
