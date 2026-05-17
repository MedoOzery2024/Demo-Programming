"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Square, TerminalSquare, Info, Folder, FileCode, LayoutTemplate, Settings, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface FileNode {
  name: string;
  language: string;
  content: string;
}

const LANGUAGES_SUPPORTED = ['html', 'javascript', 'css', 'go', 'ruby', 'dart'];

const DEFAULT_FILES: Record<string, FileNode> = {
  'index.html': { name: 'index.html', language: 'html', content: `<h1>Hello World</h1>\n<div id="app"></div>` },
  'style.css': { name: 'style.css', language: 'css', content: `h1 { color: #F59E0B; font-family: sans-serif; text-align: center; }` },
  'main.go': { name: 'main.go', language: 'go', content: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello from Go!")\n}` },
  'main.rb': { name: 'main.rb', language: 'ruby', content: `puts "Hello from Ruby!"\n` },
  'main.dart': { name: 'main.dart', language: 'dart', content: `void main() {\n  print('Hello from Dart!');\n}` },
};

function IDEWorkspace() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || 'unknown-course';
  const lessonId = searchParams.get('lessonId') || 'l1';
  
  const [files, setFiles] = useState<Record<string, FileNode>>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [output, setOutput] = useState<{level: string, text: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const openTabs = Object.keys(files);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('devverse-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'F59E0B', fontStyle: 'bold' },
          { token: 'comment', foreground: 'A3A3A3', fontStyle: 'italic' },
          { token: 'string', foreground: '34D399' },
          { token: 'number', foreground: 'FBBF24' },
          { token: 'identifier', foreground: 'E5E5E5' },
          { token: 'type', foreground: 'FCD34D' },
        ],
        colors: {
          'editor.background': '#0A0A0A',
          'editor.lineHighlightBackground': '#1A1A1A',
          'editorLineNumber.foreground': '#525252',
          'editorLineNumber.activeForeground': '#F59E0B',
          'editorIndentGuide.background': '#262626',
          'editor.selectionBackground': '#F59E0B40',
          'editorCursor.foreground': '#F59E0B',
        }
      });
      monaco.editor.setTheme('devverse-dark');
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(prev => ({
        ...prev,
        [activeFile]: { ...prev[activeFile], content: value }
      }));
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput([{ level: 'system', text: 'Compiling and executing...' }]);
    
    const ext = activeFile.split('.').pop() || '';
    
    // For browser languages
    if (ext === 'html' || ext === 'js' || ext === 'css') {
      const html = files['index.html']?.content || '';
      const css = files['style.css']?.content || '';
      
      const js = Object.values(files)
        .filter(f => f.name.endsWith('.js'))
        .map(f => f.content).join('\n');

      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
            <script>
              const originalLog = console.log;
              const originalError = console.error;
              
              console.log = function(...args) {
                window.parent.postMessage({ type: 'log', level: 'info', args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }, '*');
                originalLog.apply(console, args);
              };
              console.error = function(...args) {
                window.parent.postMessage({ type: 'log', level: 'error', args: args.map(a => String(a)) }, '*');
                originalError.apply(console, args);
              };
              
              window.onerror = function(msg, url, line) {
                window.parent.postMessage({ type: 'log', level: 'error', args: [\`\${msg} (Line \${line})\`] }, '*');
                return false;
              };
            </script>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch(e) {
                console.error(e.message);
              }
            </script>
          </body>
        </html>
      `;

      if (iframeRef.current) {
        iframeRef.current.srcdoc = srcDoc;
      }
      return;
    }

    // For backend languages
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: ext,
          code: files[activeFile].content
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Execution failed');
      
      setOutput([
        { level: 'system', text: `[Executed ${ext} successfully]` },
        ...(data.output || '').split('\n').filter(Boolean).map((t: string) => ({ level: 'info', text: t }))
      ]);
    } catch (err: any) {
       setOutput([{ level: 'error', text: err.message }]);
    }
  };

  const stopCode = () => {
    setIsRunning(false);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = '';
    }
    setOutput(prev => [...prev, { level: 'system', text: '[Execution Stopped]' }]);
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'log') {
        setOutput(prev => [...prev, { level: e.data.level, text: e.data.args.join(' ') }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const markProgress = async () => {
    if (user && courseId !== 'unknown-course') {
      try {
        const ref = doc(db, 'progress', `${user.uid}_${courseId}_${lessonId}`);
        await setDoc(ref, {
          userId: user.uid,
          courseId,
          lessonId,
          completedAt: serverTimestamp(),
        }, { merge: true });
        console.log("Progress saved");
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  const handleNext = () => {
    markProgress();
    // In a real app we'd compute the next ID, here we mock:
    alert('Lesson Marked Complete! Loading next...');
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-gray-300 font-sans overflow-hidden">
      
      {/* Sidebar Explorer */}
      <div className="w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col flex-shrink-0">
        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#141414]">
          <span className="font-semibold text-sm text-gray-200 uppercase tracking-widest">Explorer</span>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <div className="px-2 py-1 text-xs font-mono text-gold-500/50 uppercase tracking-wider mb-2">Files</div>
          <div className="flex flex-col">
            {Object.values(files).map((file) => (
              <div 
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${activeFile === file.name ? 'bg-gold-500/10 text-gold-400' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
              >
                <FileCode size={14} /> {file.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Lesson Navigation */}
        <div className="p-4 border-t border-white/5 bg-[#141414] flex flex-col gap-3">
           <div className="text-xs font-bold text-gray-500 mb-1">Course: {courseId} <br/> Lesson: {lessonId}</div>
           <div className="flex gap-2">
             <button className="flex-1 py-2 rounded bg-white/5 text-gray-400 hover:text-white text-xs font-bold flex items-center justify-center transition-colors">
               <ChevronLeft size={14} /> Prev
             </button>
             <button onClick={handleNext} className="flex-1 py-2 rounded bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 hover:text-gold-300 text-xs font-bold flex items-center justify-center transition-colors">
               Next <ChevronRight size={14} />
             </button>
           </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#141414] border-b border-white/5 flex items-center justify-between pr-4">
          <div className="flex h-full">
            {openTabs.map(tab => (
              <div 
                key={tab} 
                onClick={() => setActiveFile(tab)}
                className={`flex items-center gap-3 px-4 h-full border-r border-white/5 text-sm cursor-pointer transition-colors ${activeFile === tab ? 'bg-[#0A0A0A] border-t-2 border-t-gold-500 text-gold-400' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#222]'}`}
              >
                <FileCode size={14} /> {tab}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {isRunning ? (
              <button onClick={stopCode} className="flex items-center gap-2 px-4 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded text-sm font-medium transition-colors border border-red-500/20">
                <Square size={14} className="fill-current" /> Stop
              </button>
            ) : (
              <button onClick={runCode} className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-sm font-medium transition-colors border border-green-500/20">
                <Play size={14} className="fill-current" /> Run Sandbox
              </button>
            )}
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <Link href={`/courses/${courseId}`} className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2">
               Exit IDE
            </Link>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-[3] flex flex-col border-r border-white/5">
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={files[activeFile]?.language || 'plaintext'}
                value={files[activeFile]?.content || ''}
                onChange={handleEditorChange}
                theme="devverse-dark"
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
                  wordWrap: 'on'
                }}
              />
            </div>
            
            {/* Terminal */}
            <div className="h-48 border-t border-white/5 bg-[#0A0A0A] flex flex-col">
              <div className="h-8 border-b border-white/5 flex items-center px-4 bg-[#141414]">
                <span className="flex items-center gap-2 text-xs font-mono text-gold-500 uppercase tracking-wider">
                  <TerminalSquare size={12} /> Execution Output
                </span>
                <div className="flex-1"></div>
                <button onClick={() => setOutput([])} className="text-xs text-gray-500 hover:text-white">Clear</button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto font-mono text-sm bg-black">
                {output.length === 0 ? (
                  <div className="text-gray-600 px-2 py-1">Ready...</div>
                ) : (
                  output.map((out, i) => (
                    <div key={i} className={`px-2 py-0.5 ${out.level === 'error' ? 'text-red-400' : out.level === 'system' ? 'text-gold-500' : 'text-gray-300'}`}>
                      {out.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Web Preview */}
          <div className="flex-[2] bg-[#0A0A0A] flex flex-col">
            <div className="h-8 bg-[#141414] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
               <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
                 <LayoutTemplate size={12} /> Live Web Preview
               </span>
               <div className="flex gap-1.5 items-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
               </div>
            </div>
            <div className="flex-1 relative bg-white">
              {isRunning && (activeFile.endsWith('.html') || activeFile.endsWith('.js') || activeFile.endsWith('.css')) ? (
                <iframe 
                  ref={iframeRef}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals"
                  title="Live Preview"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] text-gray-400 text-center p-8 gap-4">
                  <Play size={48} className="text-gold-500/20" />
                  <p className="font-mono text-sm">
                    Web preview active for HTML/CSS/JS. <br/>
                    For Go, Ruby, and Dart, check the terminal output.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IDEPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-gold-500">Loading IDE...</div>}>
      <IDEWorkspace />
    </Suspense>
  );
}
