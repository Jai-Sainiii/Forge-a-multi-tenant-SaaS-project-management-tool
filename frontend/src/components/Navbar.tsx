"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import AuthModel from "./auth/AuthModel";
import { useAuth } from "@/authContext/AuthContext";
import axios from "axios";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const { theme, setTheme } = useTheme();
  const { user } = useAuth()!;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => console.error(err.message));
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-md py-3 border-outline-variant dark:border-slate-800"
            : "bg-transparent py-5 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-primary dark:text-white"
            >
              Forge
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}

              {user ? (
                <Link
                  href="/workspace/all"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                >
                  <LayoutDashboard size={15} />
                  Workspace
                </Link>
              ) : (
                <span
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                >
                  <LayoutDashboard size={15} />
                  Workspace
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )
              ) : (
                <div className="w-[18px] h-[18px]" />
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 border border-outline-variant dark:border-slate-700 rounded-full pl-1 pr-3 py-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-none">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpen(true);
                    setActiveTab("login");
                  }}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setActiveTab("signup");
                  }}
                  className="bg-primary-light hover:bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Start for free
                </button>
              </div>
            )}

            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-outline-variant dark:border-slate-800 px-6 py-5 flex flex-col gap-3 md:hidden shadow-sm"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMobile}
                  className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white transition-colors py-1"
                >
                  {label}
                </Link>
              ))}

              {user ? (
                <Link
                  href="/workspace/all"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                >
                  <LayoutDashboard size={15} />
                  Workspace
                </Link>
              ) : (
                <span
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                >
                  <LayoutDashboard size={15} />
                  Workspace
                </span>
              )}

              <div className="h-px bg-outline-variant dark:bg-slate-800 my-1" />

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobile();
                  }}
                  className="text-base font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white py-1 text-left cursor-pointer"
                >
                  Log out
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setOpen(true);
                      closeMobile();
                      setActiveTab("login");
                    }}
                    className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-white py-1 text-left cursor-pointer"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setOpen(true);
                      closeMobile();
                      setActiveTab("signup");
                    }}
                    className="bg-primary-light text-white text-sm font-medium px-4 py-2.5 rounded-lg w-fit cursor-pointer"
                  >
                    Start for free
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModel
        isOpen={open}
        onClose={() => setOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}
