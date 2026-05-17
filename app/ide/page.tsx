"use client";

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Check, TerminalSquare, Info } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveIDE() {
  const [code, setCode] = useState('// Welcome to Demo Programming IDE\n// Write your code here\n\nfunction greet() {\n  return "Hello, World!";\n}\n\nconsole.log(greet());');
  const [output, setOutput] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const runCode = () => {
    try {
      setOutput('');
      setIsSuccess(false);
      // Sandbox execution - simple for demonstration
      const originalConsoleLog = console.log;
      let terminalOutput = '';
      console.log = (...args) => {
        terminalOutput += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ') + '\\n';
      };
      
      new Function(code)();
      
      console.log = originalConsoleLog;
      setOutput(terminalOutput);
      
      if (terminalOutput.includes('Hello, World!')) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* IDE Header */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#141414] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-sm font-medium text-gray-300">Basic Functions - JavaScript</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-md text-sm font-medium transition-colors"
          >
            <Play size={14} /> Run Code
          </button>
          {isSuccess && (
            <button className="flex items-center gap-2 px-4 py-1.5 bg-gold-500 text-black rounded-md text-sm font-semibold transition-colors">
              Submit Lesson <Check size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main IDE area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Instruction Panel */}
        <div className="w-[30%] min-w-[300px] max-w-[400px] border-r border-white/10 flex flex-col bg-[#0f0f0f]">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
              <Info size={12} /> Instructions
            </div>
            <h2 className="text-2xl font-display font-semibold mb-4 text-white">Your First Function</h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <p>Functions are one of the fundamental building blocks in JavaScript. A function in JavaScript is similar to a procedure—a set of statements that performs a task or calculates a value.</p>
              <p>In this lesson, you will run a simple function that returns &quot;Hello, World!&quot;.</p>
              
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
                <h3 className="text-white font-medium mb-2">Task:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Review the code in the editor.</li>
                  <li>Click <strong>Run Code</strong>.</li>
                  <li>Ensure the terminal prints &quot;Hello, World!&quot;.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Editor & Terminal Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          
          {/* Terminal */}
          <div className="h-[30%] min-h-[200px] border-t border-white/10 bg-[#0A0A0A] flex flex-col">
            <div className="h-10 border-b border-white/5 flex items-center px-4 bg-[#141414]">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500">
                <TerminalSquare size={14} /> Terminal
              </span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
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
