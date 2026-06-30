"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordForm({
  onClose,
  onOtpSent,
  onBackToLogin,
}: {
  onClose: () => void;
  onOtpSent: (email: string) => void;
  onBackToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await forgotPasswordAction(email);
      if (res.success) {
        onOtpSent(email);
      } else {
        setError(res.message || "Failed to request reset. Please check your email.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-[22px] font-medium tracking-tight text-[#1c1b1d] dark:text-white leading-tight">
        Reset password
      </h2>
      <p className="text-[13px] text-[#787582] mt-1 mb-6">
        Enter your email address to receive a verification OTP to reset your password.
      </p>

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-[13px]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="email"
          value={email}
          placeholder="Work email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full h-10 px-3 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center gap-2 bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-850 text-sm font-medium rounded-[4px] transition-colors active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Send OTP <ArrowRight size={15} />
          </>
        )}
      </button>

      <div className="flex justify-center mt-5">
        <button
          onClick={onBackToLogin}
          className="text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
        >
          Back to Log in
        </button>
      </div>
    </div>
  );
}
