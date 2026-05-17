"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../../lib/firestore-error';

// Mock data
const course = {
  id: 'react-mastery',
  title: 'React 19 & Next.js 15 Mastery',
  description: 'Learn to build highly scalable, interactive web applications using the latest features of React 19 and the Next.js 15 App Router.',
  overview: `
### What you will learn
- **React 19 Server Components:** Unlock the power of server-first architecture.
- **Next.js 15 App Router:** File-system based routing that scales.
- **State Management:** Modern patterns with React Hooks.
- **Deployment:** Vercel, Firebase Hosting, and cloud architecture.

### Requirements
- Basic understanding of HTML, CSS, JavaScript.
- Familiarity with basic ES6 concepts (arrow functions, destructuring).
`,
  xpReward: 5000,
  modules: [
    { id: 'm1', title: 'Getting Started with Next.js 15', lessons: [
      { id: 'l1', title: 'Introduction to App Router', duration: '12 min' },
      { id: 'l2', title: 'Server vs Client Components', duration: '18 min' },
      { id: 'l3', title: 'Data Fetching Mastery', duration: '25 min' }
    ]},
    { id: 'm2', title: 'Advanced React 19 Features', lessons: [
      { id: 'l4', title: 'The use() Hook', duration: '15 min' },
      { id: 'l5', title: 'Actions & useTransition', duration: '22 min' },
    ]}
  ]
};

export default function CourseDetails({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;
  const { user, initialized } = useAuth();
  
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'overview'>('curriculum');

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      setLoadingProgress(false);
      return;
    }

    async function fetchProgress() {
      try {
        const ref = doc(db, 'progress', `${user!.uid}_${courseId}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCompletedLessons(snap.data().completedLessons || []);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, 'progress');
      } finally {
        setLoadingProgress(false);
      }
    }
    fetchProgress();
  }, [user, initialized, courseId]);

  let isNextUnlocked = true; // First lesson is always unlocked

  return (
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto w-full pb-20">
      <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
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
        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mb-8">
          {course.description}
        </p>

        <div className="flex gap-4 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'curriculum' ? 'border-gold-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            Curriculum
          </button>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-gold-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            Overview
          </button>
        </div>
      </header>

      {loadingProgress ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-gold-500" size={32} />
        </div>
      ) : activeTab === 'overview' ? (
        <div className="prose prose-invert prose-gold max-w-none glass p-8 rounded-2xl">
          <Markdown remarkPlugins={[remarkGfm]}>{course.overview}</Markdown>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
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
                {mod.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isUnlocked = isNextUnlocked;
                  if (!isCompleted) isNextUnlocked = false; // Lock subsequent lessons

                  return (
                    <div key={lesson.id} className="p-4 px-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        {isCompleted && <CheckCircle2 className="text-green-500" size={20} />}
                        {!isCompleted && isUnlocked && <PlayCircle className="text-gold-500" size={20} />}
                        {!isCompleted && !isUnlocked && <Lock className="text-gray-600" size={20} />}
                        <span className={`font-medium ${!isCompleted && !isUnlocked ? 'text-gray-500' : 'text-gray-200'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-mono text-gray-500">{lesson.duration}</span>
                        {isUnlocked || isCompleted ? (
                          <Link href={`/ide?courseId=${courseId}&lessonId=${lesson.id}`} className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${isCompleted ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/10 hover:bg-gold-500 hover:text-black text-white'}`}>
                            {isCompleted ? 'Review' : 'Start'}
                          </Link>
                        ) : (
                          <div className="px-4 py-2 rounded-full bg-white/5 text-gray-600 text-sm font-medium cursor-not-allowed">
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
  );
}
