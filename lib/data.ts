import { Code2, Rocket, FolderKanban, Database, DatabaseZap, LayoutTemplate, Coffee, FileCode2, Zap, Layers, Server } from 'lucide-react';

export const COURSES = [
  // Web Basics
  { id: 'html-css-mastery', title: 'HTML5 & modern CSS3', level: 'Beginner', xp: 2000, color: 'from-orange-500/20 to-pink-500/5', icon: LayoutTemplate, overview: 'Master the building blocks of the web. Learn HTML semantics and CSS layouts including Flexbox and Grid.' },
  { id: 'javascript-essentials', title: 'JavaScript Essentials', level: 'Beginner', xp: 3000, color: 'from-yellow-500/20 to-orange-500/5', icon: FileCode2, overview: 'Core JavaScript concepts. Variables, functions, loops, DOM manipulation, and asynchronous programming.' },
  
  // Advanced Web & TS
  { id: 'typescript-pro', title: 'TypeScript Pro', level: 'Intermediate', xp: 4000, color: 'from-blue-500/20 to-cyan-500/5', icon: Code2, overview: 'Transition from dynamically typed JavaScript to statically typed TypeScript for safer, scalable code.' },
  { id: 'react-mastery', title: 'React 19 & Next.js 15 Mastery', level: 'Intermediate', xp: 5000, color: 'from-cyan-500/20 to-blue-500/5', icon: Code2, overview: 'Build full-stack applications with React Server Components, Next.js App Router, and caching.' },
];

export const ROADMAPS = [
  { title: 'Frontend Developer', progress: 45, total: 100 },
  { title: 'Backend Developer', progress: 10, total: 100 },
  { title: 'Full Stack Developer', progress: 0, total: 100 },
];
