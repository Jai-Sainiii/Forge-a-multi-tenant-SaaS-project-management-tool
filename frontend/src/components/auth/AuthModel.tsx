"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[440px] bg-white dark:bg-[#0f172a] border border-[#c8c4d3] dark:border-slate-700 rounded-xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
          
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 text-[#787582] hover:text-[#1c1b1d] dark:hover:text-white hover:bg-[#f0edf0] dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="p-10">
             
              <div className="mb-8">
                <span className="text-xl font-bold tracking-tight text-[#251b72] dark:text-white">
                  Forge
                </span>
              </div>

              
              <div className="inline-flex items-center bg-[#f0edf0] dark:bg-slate-800 rounded-full p-1 mb-8">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === "login"
                      ? "bg-[#251b72] text-white"
                      : "text-[#474551] dark:text-slate-400 hover:text-[#1c1b1d] dark:hover:text-white"
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-[#251b72] text-white"
                      : "text-[#474551] dark:text-slate-400 hover:text-[#1c1b1d] dark:hover:text-white"
                  }`}
                >
                  Create account
                </button>
              </div>

              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "login" ? 8 : -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === "login" ? (
                    <LoginForm onClose={onClose} />
                  ) : (
                    <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}