"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, Square, TerminalSquare, Info, Folder, FileCode, SplitSquareHorizontal, LayoutTemplate, Settings, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FileNode {
  name: string;
  language: string;
  content: string;
  isOpen?: boolean;
}

const DEFAULT_FILES: Record<string, FileNode> = {
  'index.html': {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <h1>Hello World</h1>
    <button id="btn">Click Me</button>
    <div id="result"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
  },
  'style.css': {
    name: 'style.css',
    language: 'css',
    content: `body {
  font-family: system-ui, sans-serif;
  background: #111;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
button {
  background: #F59E0B;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:hover { background: #FBBF24; }`
  },
  'script.js': {
    name: 'script.js',
    language: 'javascript',
    content: `let count = 0;
const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click', () => {
  count++;
  result.textContent = \`Clicked \${count} times\`;
  console.log('Button clicked', count);
});

console.log('App initialized');`
  }
};

function IDEWorkspace() {
  const [files, setFiles] = useState<Record<string, FileNode>>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [output, setOutput] = useState<{level: string, text: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Tabs management
  const openTabs = Object.keys(files).filter(k => files[k].isOpen !== false);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('devverse-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'F59E0B' },
          { token: 'comment', foreground: 'A3A3A3', fontStyle: 'italic' },
          { token: 'string', foreground: '34D399' },
        ],
        colors: {
          'editor.background': '#0A0A0A',
          'editor.lineHighlightBackground': '#1A1A1A',
          'editorLineNumber.foreground': '#525252',
          'editorIndentGuide.background': '#262626',
        }
      });
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

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Combine HTML, CSS, JS
    const html = files['index.html']?.content || '';
    const css = files['style.css']?.content || '';
    const js = files['script.js']?.content || '';

    // Create execution environment
    const srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>\${css}</style>
          <script>
            // Intercept console
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              window.parent.postMessage({ type: 'log', level: 'info', args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }, '*');
              originalLog.apply(console, args);
            };
            console.error = function(...args) {
              window.parent.postMessage({ type: 'log', level: 'error', args: args.map(a => String(a)) }, '*');
              originalError.apply(console, args);
            };
            
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({ type: 'log', level: 'error', args: [\`\${msg} (Line \${line})\`] }, '*');
              return false;
            };
          </script>
        </head>
        <body>
          \${html}
          <script>
            try {
              \${js}
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

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-gray-300 font-sans overflow-hidden">
      
      {/* Sidebar / Explorer */}
      <div className="w-64 border-r border-white/5 bg-[#0f0f0f] flex flex-col flex-shrink-0">
        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black">
          <span className="font-semibold text-sm tracking-wide text-gray-200">EXPLORER</span>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-400 hover:text-white cursor-pointer group">
            <Folder size={14} className="group-hover:text-gold-500 transition-colors" /> src
          </div>
          <div className="pl-4 flex flex-col mt-1">
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
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar & Tabs */}
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
              <button onClick={stopCode} className="flex items-center gap-2 px-4 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded text-sm font-medium transition-colors">
                <Square size={14} className="fill-current" /> Stop
              </button>
            ) : (
              <button onClick={runCode} className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-sm font-medium transition-colors">
                <Play size={14} className="fill-current" /> Run
              </button>
            )}
            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
            <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2">
               Exit
            </Link>
          </div>
        </div>

        {/* Editor & Preview Split */}
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
            <div className="h-48 border-t border-white/5 bg-[#0f0f0f] flex flex-col">
              <div className="h-8 border-b border-white/5 flex items-center px-4 bg-[#141414]">
                <span className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  <TerminalSquare size={12} /> Console
                </span>
                <div className="flex-1"></div>
                <button onClick={() => setOutput([])} className="text-xs text-gray-500 hover:text-white">Clear</button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto font-mono text-sm">
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

          {/* Live Preview */}
          <div className="flex-[2] bg-white flex flex-col">
            <div className="h-8 bg-black border-b border-white/5 flex items-center px-4 justify-between shrink-0">
               <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
                 <LayoutTemplate size={12} /> Preview
               </span>
               <div className="flex gap-1.5 items-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
               </div>
            </div>
            <div className="flex-1 relative bg-white">
              {isRunning ? (
                <iframe 
                  ref={iframeRef}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals"
                  title="Live Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 flex-col gap-4 text-gray-400">
                  <Play size={48} className="opacity-20" />
                  <p className="font-medium">Click Run to execute code</p>
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
