import { Code2, Rocket, FolderKanban, Database, DatabaseZap, LayoutTemplate, Coffee, FileCode2, Zap, Layers, Server } from 'lucide-react';

export const COURSES = [
  // Web Basics
  { id: 'html-css-mastery', title: 'HTML5 & modern CSS3', level: 'Beginner', xp: 2000, color: 'from-orange-500/20 to-pink-500/5', icon: LayoutTemplate, overview: 'Master the building blocks of the web. Learn HTML semantics and CSS layouts including Flexbox and Grid.' },
  { id: 'javascript-essentials', title: 'JavaScript Essentials', level: 'Beginner', xp: 3000, color: 'from-yellow-500/20 to-orange-500/5', icon: FileCode2, overview: 'Core JavaScript concepts. Variables, functions, loops, DOM manipulation, and asynchronous programming.' },
  
  // Advanced Web & TS
  { id: 'typescript-pro', title: 'TypeScript Pro', level: 'Intermediate', xp: 4000, color: 'from-blue-500/20 to-cyan-500/5', icon: Code2, overview: 'Transition from dynamically typed JavaScript to statically typed TypeScript for safer, scalable code.' },
  { id: 'react-mastery', title: 'React 19 & Next.js 15 Mastery', level: 'Intermediate', xp: 5000, color: 'from-cyan-500/20 to-blue-500/5', icon: Code2, overview: 'Build full-stack applications with React Server Components, Next.js App Router, and caching.' },
  
  // Scripting & Backend Languages
  { id: 'python-ai', title: 'Python AI Engineering', level: 'Advanced', xp: 8000, color: 'from-gold-500/20 to-yellow-500/5', icon: Rocket, overview: 'Learn Python programming from scratch to advanced AI model integration and data processing.' },
  { id: 'php-modern', title: 'Modern PHP & Laravel', level: 'Intermediate', xp: 4500, color: 'from-indigo-500/20 to-purple-500/5', icon: Server, overview: 'Build robust web applications using PHP 8 and the Laravel framework.' },
  { id: 'nodejs-backend', title: 'Node.js Backend Architecture', level: 'Intermediate', xp: 5500, color: 'from-green-500/20 to-emerald-500/5', icon: Server, overview: 'Learn about Event Loop, Express.js, APIs, and scalable backend services in Node.' },
  
  // Compiled & System Languages
  { id: 'c-systems', title: 'C Systems Programming', level: 'Advanced', xp: 7000, color: 'from-gray-500/20 to-slate-500/5', icon: Zap, overview: 'Memory management, pointers, concurrency, and building high-performance systems in C.' },
  { id: 'cpp-game-engine', title: 'C++ Game Engine Dev', level: 'Advanced', xp: 9000, color: 'from-blue-600/20 to-indigo-600/5', icon: Zap, overview: 'Object-oriented programming in C++, STL, graphics APIs, and engine architecture.' },
  { id: 'java-enterprise', title: 'Java Enterprise Computing', level: 'Intermediate', xp: 6000, color: 'from-red-500/20 to-orange-500/5', icon: Coffee, overview: 'Java fundamentals, Spring Boot, microservices, and enterprise application patterns.' },

  // Databases
  { id: 'fullstack-firebase', title: 'Full-Stack Firebase', level: 'Beginner', xp: 3000, color: 'from-orange-500/20 to-red-500/5', icon: FolderKanban, overview: 'Master Firestore rules, Authentication, Cloud Functions, and NoSQL data modeling.' },
  { id: 'mongodb-nosql', title: 'MongoDB & NoSQL', level: 'Intermediate', xp: 4000, color: 'from-green-600/20 to-emerald-600/5', icon: Database, overview: 'Document structures, aggregation pipelines, indexing, and Mongoose for Node.js.' },
  { id: 'postgresql-mastery', title: 'PostgreSQL Mastery', level: 'Advanced', xp: 6000, color: 'from-blue-500/20 to-indigo-500/5', icon: DatabaseZap, overview: 'Advanced SQL, relational modeling, performance tuning, and PL/pgSQL functions.' },
  { id: 'mysql-fundamentals', title: 'MySQL Fundamentals', level: 'Beginner', xp: 3500, color: 'from-blue-400/20 to-cyan-400/5', icon: Database, overview: 'Learn basic SQL syntax, joins, grouping, and simple relational database administration.' },
  { id: 'sqlite-local', title: 'SQLite for Local Apps', level: 'Beginner', xp: 2500, color: 'from-sky-500/20 to-blue-500/5', icon: Database, overview: 'Using SQLite for mobile apps, desktop apps, and lightweight embedded databases.' },
  { id: 'supabase-realtime', title: 'Supabase & Realtime Apps', level: 'Intermediate', xp: 4500, color: 'from-emerald-500/20 to-green-500/5', icon: Layers, overview: 'PostgreSQL meets Firebase. Learn row-level security, realtime subscriptions, and edge functions.' },
];

export const ROADMAPS = [
  { title: 'Frontend Developer', progress: 45, total: 100 },
  { title: 'Backend Developer', progress: 10, total: 100 },
  { title: 'Full Stack Developer', progress: 0, total: 100 },
  { title: 'Database Administrator', progress: 5, total: 100 },
  { title: 'Systems Programmer', progress: 0, total: 100 },
];
