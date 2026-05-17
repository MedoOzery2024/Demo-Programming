"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Check, TerminalSquare, Info, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore-error';

// Hardcoded mock data to simulate courses lookup
const MOCK_COURSES: Record<string, any> = {
  'react-mastery': {
    title: 'React 19 & Next.js 15 Mastery',
    modules: [
      { id: 'm1', lessons: [
        { id: 'l1', title: 'Introduction to App Router', content: '# Introduction\n\nWelcome to the first lesson! Create a function that prints "App Router!".\n\n```javascript\nfunction run() {\n  return "App Router!";\n}\n```', seedCode: 'function run() {\n  // Write code here\n  \n}\nconsole.log(run());', expectedOutput: 'App Router!' },
        { id: 'l2', title: 'Server vs Client Components', content: '# Server vs Client\n\nCreate a component name constant.\n\n```javascript\nconst component = "Server Component";\nconsole.log(component);\n```', seedCode: 'const component = "";\nconsole.log(component);', expectedOutput: 'Server Component' },
        { id: 'l3', title: 'Data Fetching Mastery', content: '# Data Fetching\n\nFetch some data.\n\n```javascript\nconsole.log("Data fetched!");\n```', seedCode: 'console.log("Data fetched!");', expectedOutput: 'Data fetched!' }
      ]},
    ]
  }
};

function IDEContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId') || 'react-mastery';
  const lessonId = searchParams.get('lessonId') || 'l1';
  
  const { user, profile } = useAuth();
  
  const [code, setCode] = useState('// Loading...\n');
  const [output, setOutput] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const courseData = MOCK_COURSES[courseId];
  let currentLesson = null;
  let prevLesson = null;
  let nextLesson = null;
  
  if (courseData) {
    const allLessons = courseData.modules.flatMap((m: any) => m.lessons);
    const lessonIndex = allLessons.findIndex((l: any) => l.id === lessonId);
    if (lessonIndex !== -1) {
      currentLesson = allLessons[lessonIndex];
      prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
      nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
    }
  }

  useEffect(() => {
    if (currentLesson) {
      setCode(currentLesson.seedCode);
      setOutput('');
      setIsSuccess(false);
    }
  }, [lessonId]);

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('demo-gold', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'F59E0B' }, // gold-500
        { token: 'comment', foreground: 'A3A3A3', fontStyle: 'italic' },
        { token: 'string', foreground: '34D399' },
        { token: 'identifier', foreground: 'FAFAFA' },
      ],
      colors: {
        'editor.background': '#0A0A0A',
        'editor.lineHighlightBackground': '#141414',
        'editorLineNumber.foreground': '#525252',
        'editorIndentGuide.background': '#262626',
        'editorSuggestWidget.background': '#141414',
        'editorSuggestWidget.border': '#F59E0B',
      }
    });
  };

  const runCode = () => {
    if (!iframeRef.current) return;
    setOutput('');
    setIsSuccess(false);
    
    // Create an iframe to safely execute JS
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              window.parent.postMessage({ type: 'error', message: msg }, '*');
              return false;
            };
            const originalConsoleLog = console.log;
            console.log = function(...args) {
              const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
              originalConsoleLog.apply(console, args);
              window.parent.postMessage({ type: 'log', message: msg }, '*');
            };
          </script>
        </head>
        <body>
          <script>
            try {
              ${code}
            } catch (e) {
              window.parent.postMessage({ type: 'error', message: e.message }, '*');
            }
          </script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = html;
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Validate origin if not srcdoc, but srcdoc has 'null' origin usually
      if (e.data && e.data.type === 'log') {
        setOutput((prev) => prev + e.data.message + '\n');
        if (currentLesson && currentLesson.expectedOutput && e.data.message.includes(currentLesson.expectedOutput)) {
          setIsSuccess(true);
        } else if (!currentLesson?.expectedOutput) {
          // If no expected output, just running successfully is a win
          setIsSuccess(true);
        }
      } else if (e.data && e.data.type === 'error') {
        setOutput((prev) => prev + 'Error: ' + e.data.message + '\n');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentLesson]);

  const submitProgress = async () => {
    if (!user || !isSuccess) return;
    
    setIsSubmitting(true);
    const progressId = `${user.uid}_${courseId}`;
    try {
      const ref = doc(db, 'progress', progressId);
      const snap = await getDoc(ref);
      
      let completed = [lessonId];
      if (snap.exists()) {
        const data = snap.data();
        completed = Array.from(new Set([...(data.completedLessons || []), lessonId]));
      }

      await setDoc(ref, {
        userId: user.uid,
        courseId,
        completedLessons: completed,
        updatedAt: Date.now()
      });

      if (nextLesson) {
        router.push(`/ide?courseId=${courseId}&lessonId=${nextLesson.id}`);
      } else {
        router.push(`/courses/${courseId}`);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentLesson) {
    return <div className="h-screen w-full flex items-center justify-center bg-dark-900 border text-white">Lesson not found</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0A]">
      <iframe ref={iframeRef} sandbox="allow-scripts" style={{ display: 'none' }} title="sandbox" />
      
      {/* IDE Header */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#141414] shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${courseId}`} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-sm font-medium text-gray-300">{currentLesson.title}</span>
        </div>
        
        <div className="flex flex-1 justify-center gap-2">
          {prevLesson && (
            <Link href={`/ide?courseId=${courseId}&lessonId=${prevLesson.id}`} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs flex items-center gap-1">
              <ChevronLeft size={14} /> Prev
            </Link>
          )}
          {nextLesson && (
            <Link href={`/ide?courseId=${courseId}&lessonId=${nextLesson.id}`} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs flex items-center gap-1">
              Next <ChevronRight size={14} />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-md text-sm font-medium transition-colors"
          >
            <Play size={14} /> Run
          </button>
          
          <button 
            onClick={submitProgress}
            disabled={!isSuccess || isSubmitting || !user}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              isSuccess ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-gold-400' : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isSuccess ? (nextLesson ? 'Next Lesson' : 'Complete Module') : 'Submit'}
          </button>
        </div>
      </header>

      {/* Main IDE area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Instruction Panel */}
        <div className="w-[35%] min-w-[300px] border-r border-white/10 flex flex-col bg-[#0f0f0f]">
          <div className="p-6 overflow-y-auto flex-1 prose prose-invert prose-gold max-w-none">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-500/20 not-prose">
              <Info size={12} /> Instructions
            </div>
            
            <Markdown remarkPlugins={[remarkGfm]}>
              {currentLesson.content}
            </Markdown>

            {!user && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 not-prose">
                <Info size={16} /> Sign in to save progress
              </div>
            )}
          </div>
        </div>

        {/* Editor & Terminal Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              beforeMount={handleEditorWillMount}
              theme="demo-gold"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorWidth: 2,
                renderLineHighlight: 'all',
              }}
            />
          </div>
          
          {/* Terminal */}
          <div className="h-[30%] min-h-[200px] border-t border-white/10 bg-[#0A0A0A] flex flex-col">
            <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#141414]">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500">
                <TerminalSquare size={14} /> Console
              </span>
              {output && (
                <button onClick={() => setOutput('')} className="text-xs text-gray-500 hover:text-white transition-colors">Clear</button>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed">
              {output ? (
                 <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-gray-600">Output will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveIDE() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center text-white"><Loader2 className="animate-spin text-gold-500" size={32} /></div>}>
      <IDEContent />
    </Suspense>
  );
}
