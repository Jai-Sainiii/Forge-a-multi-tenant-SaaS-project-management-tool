"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { verifyOtpAction, resendOtpAction } from "@/app/actions/auth";
import { useAuth } from "@/authContext/AuthContext";

export default function OtpVerifyForm({
  email,
  onClose,
  onSuccess,
}: {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const auth = useAuth();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await verifyOtpAction(email, code);
      if (res.success) {
        setSuccess("Account verified successfully!");
        if (auth && res.user) {
          auth.setUser(res.user);
        }
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(res.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      setError("An error occurred during verification. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await resendOtpAction(email);
      if (res.success) {
        setSuccess("A new code has been sent!");
        setTimeLeft(60);
        setCanResend(false);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || "Could not resend OTP. Try again.");
      }
    } catch (err) {
      setError("An error occurred. Try again.");
    }
  };

  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-[22px] font-medium tracking-tight text-[#1c1b1d] dark:text-white leading-tight">
        Verify your email
      </h2>
      <p className="text-[13px] text-[#787582] mt-1 mb-6">
        We've sent a 6-digit code to <span className="font-semibold text-[#3C3489] dark:text-violet-400">{email}</span>. Enter it below to confirm your account.
      </p>

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-[13px]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#86f2e4]/30 border border-[#006a61]/20 text-[#006a61] text-[13px]">
          {success}
        </div>
      )}

      {/* Code Input boxes */}
      <div className="flex justify-between gap-2 mb-6">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={idx === 0 ? handlePaste : undefined}
            className="w-12 h-12 text-center text-lg font-semibold bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-[#3C3489] focus:ring-1 focus:ring-[#3C3489] transition-all"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isLoading || success !== null}
        className="w-full h-11 flex items-center justify-center gap-2 bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-850 text-sm font-medium rounded-[4px] transition-colors active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Verify Account <ArrowRight size={15} />
          </>
        )}
      </button>

      <div className="mt-6 pt-5 border-t border-[#c8c4d3] dark:border-slate-700 flex flex-col items-center gap-2">
        <p className="text-[12px] text-[#787582]">
          Didn't receive the code?{" "}
          {!canResend && (
            <span className="font-medium text-[#3C3489] dark:text-violet-400">
              Resend in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          )}
        </p>
        {canResend && (
          <button
            onClick={handleResend}
            className="text-[12px] font-semibold text-[#006a61] hover:underline cursor-pointer"
          >
            Resend code
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1.5 opacity-60 text-[11px] text-[#787582]">
        <Lock size={12} />
        <span className="uppercase tracking-widest">End-to-end encrypted</span>
      </div>
    </div>
  );
}
