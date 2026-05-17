"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Crown, Medal, Flame } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

// Hardcoded existing users + actual logged in user
const BASE_LEADERBOARD = [
  { rank: 1, uid: '1', displayName: 'AlexTheDev', level: 50, xp: 125000, trend: 'up', streak: 45 },
  { rank: 2, uid: '2', displayName: 'CodeNinja99', level: 48, xp: 112000, trend: 'up', streak: 30 },
  { rank: 3, uid: '3', displayName: 'SarahScripts', level: 45, xp: 98000, trend: 'down', streak: 12 },
  { rank: 5, uid: '4', displayName: 'ByteMe', level: 40, xp: 75000, trend: 'down', streak: 5 },
];

export default function Leaderboard() {
  const { user, xp, level } = useAuth() as any;

  // Insert current user in place 4 if auth is present
  const leaderboardData = [...BASE_LEADERBOARD];
  if (user) {
    leaderboardData.push({
      rank: 4, 
      uid: user.uid, 
      displayName: user.displayName || 'You', 
      level: level, 
      xp: xp, 
      trend: 'up', 
      streak: 1 
    });
  }
  
  leaderboardData.sort((a,b) => b.xp - a.xp);
  leaderboardData.forEach((u, i) => u.rank = i + 1);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 flex items-center gap-4">
              <Trophy className="text-gold-500" size={36} /> Global Leaderboard
            </h1>
            <p className="text-gray-400">Compete with developers worldwide. Earn XP by completing projects and daily challenges.</p>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-[#141414] text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-right pr-4">Total XP</div>
          </div>
          
          <div className="divide-y divide-white/5 bg-[#0A0A0A]">
            {leaderboardData.map((u) => {
              const isCurrentUser = user && u.uid === user.uid;
              return (
              <motion.div 
                key={u.uid}
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: u.rank * 0.1}}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${isCurrentUser ? 'bg-gold-500/10 border-l-4 border-gold-500' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
              >
                <div className="col-span-1 flex justify-center">
                  {u.rank === 1 ? <Crown className="text-yellow-500" size={24} /> :
                   u.rank === 2 ? <Medal className="text-gray-300" size={24} /> :
                   u.rank === 3 ? <Medal className="text-orange-600" size={24} /> :
                   <span className="text-gray-500 font-bold text-lg">{u.rank}</span>}
                </div>
                
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                    {u.displayName.charAt(0)}
                  </div>
                  <span className={`font-bold ${isCurrentUser ? 'text-gold-400' : 'text-white'}`}>{u.displayName}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs font-bold text-gray-300">
                    Lvl {u.level}
                  </div>
                </div>

                <div className="col-span-2 flex justify-center items-center gap-1.5">
                  <Flame size={16} className={u.streak > 10 ? "text-orange-500" : "text-gray-600"} />
                  <span className="font-mono text-sm text-gray-300">{u.streak}</span>
                </div>

                <div className="col-span-2 text-right pr-4 font-mono font-bold text-gold-500">
                  {u.xp.toLocaleString()} XP
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
