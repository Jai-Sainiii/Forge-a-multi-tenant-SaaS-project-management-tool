"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { resetPasswordAction } from "@/app/actions/auth";

export default function ResetPasswordForm({
  email,
  onClose,
  onSuccess,
  onBackToLogin,
}: {
  email: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onBackToLogin: () => void;
}) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (code.length < 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await resetPasswordAction({
        email,
        code,
        newPassword,
      });

      if (res.success) {
        onSuccess("Password updated successfully! You can now log in.");
        onBackToLogin();
      } else {
        setError(res.message || "Failed to reset password. Check your OTP code.");
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
        Enter new password
      </h2>
      <p className="text-[13px] text-[#787582] mt-1 mb-6">
        Enter the OTP code sent to <span className="font-semibold">{email}</span> and choose a new password.
      </p>

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-[13px]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          value={code}
          maxLength={6}
          placeholder="6-digit OTP Code"
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full h-10 px-3 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            placeholder="New password"
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full h-10 px-3 pr-10 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787582] hover:text-[#474551] dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
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
            Reset Password <ArrowRight size={15} />
          </>
        )}
      </button>

      <div className="flex justify-center mt-5">
        <button
          onClick={onBackToLogin}
          className="text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
