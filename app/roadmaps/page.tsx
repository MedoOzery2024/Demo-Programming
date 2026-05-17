"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Map, CheckCircle2, GitBranch } from 'lucide-react';

const PATHS = [
  { id: 'frontend', title: 'Frontend Mastery', description: 'HTML, CSS, JS, React', progress: 45, locked: false },
  { id: 'backend', title: 'Backend Engineering', description: 'Node.js, Databases', progress: 10, locked: false },
]

export default function Roadmaps() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Link href="/">Back</Link>
      <h1>Roadmaps</h1>
      {PATHS.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  );
}
