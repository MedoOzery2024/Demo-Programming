"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Link href="/">Back</Link>
      <h1>Leaderboard</h1>
    </div>
  );
}
