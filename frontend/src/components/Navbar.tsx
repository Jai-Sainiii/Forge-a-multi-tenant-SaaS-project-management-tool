"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-3 border-outline-variant dark:border-slate-800" : "bg-transparent py-5 border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-bold text-primary dark:text-white tracking-tight"
          >
            Forge
          </Link>
          <div className="hidden md:flex gap-8">
            {["Product", "Solutions", "Pricing", "Resources"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white px-4 py-2 hidden sm:block cursor-pointer">
            Log in
          </button>
          <button className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer">
            Start for free
          </button>
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-outline-variant dark:border-slate-800 p-6 flex flex-col gap-4 md:hidden"
          >
            {["Product", "Solutions", "Pricing", "Resources"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-outline-variant dark:bg-slate-800 my-2" />
            <button className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white py-2 text-left cursor-pointer">
              Log in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
