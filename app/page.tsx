"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Terminal, Layout, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 atmosphere pointer-events-none"></div>
      
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="font-display font-bold text-2xl tracking-tighter text-white">
          <span className="text-gold-500">Demo</span>Programming.
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/courses" className="hover:text-gold-400 transition-colors">Courses</Link>
          <Link href="/projects" className="hover:text-gold-400 transition-colors">Projects</Link>
          <Link href="/login" className="px-6 py-2 rounded-full border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 transition-all">Sign In</Link>
        </nav>
      </header>

      <div className="z-10 container mx-auto px-6 h-full flex flex-col justify-center max-w-6xl mt-32 md:mt-48">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
            Next-Gen Education Platform
          </div>
          
          <h1 className="font-display font-semibold text-6xl md:text-8xl leading-[0.9] tracking-tighter text-white mb-6">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Future</span><br />
            of Software.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 font-sans leading-relaxed">
            The most advanced PWA programming ecosystem. Build real-world projects, run code directly in your browser, and learn from 0 to Senior architecture.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/courses" className="glass-gold text-gold-300 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-gold-500/10 transition-all border border-gold-500/50 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              Start Learning Now <ArrowRight size={18} />
            </Link>
            <Link href="/courses" className="glass text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all">
              View Curriculum
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
        >
          {[
            { icon: <Terminal size={24} className="text-gold-500" />, title: "In-Browser IDE", desc: "Write, run, and test code instantly. No local setup required." },
            { icon: <Layout size={24} className="text-gold-500" />, title: "Real-World Projects", desc: "Build enterprise-grade software. Stop writing 'hello world'." },
            { icon: <Database size={24} className="text-gold-500" />, title: "Full-Stack Mastery", desc: "Learn frontend, backend, databases, and deployment." },
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl hover:bg-white/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      <style jsx>{`
        .atmosphere {
          background:
            radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
          filter: blur(80px);
        }
      `}</style>
    </main>
  );
}
