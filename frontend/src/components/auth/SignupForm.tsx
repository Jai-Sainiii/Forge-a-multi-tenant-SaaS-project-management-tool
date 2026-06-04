"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/authContext/AuthContext";
import { signupUser, getCurrentUser } from "@/app/actions/auth";

export default function SignupForm({
  onSwitchToLogin,
  onClose,
}: {
  onSwitchToLogin: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const auth = useAuth();

  const handleGoogleLogin = () => {
    setError(null);
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/api/auth/google`,
      "google-oauth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        try {
          const user = await getCurrentUser();
          if (auth && user) {
            auth.setUser(user);
          }
          onClose();
        } catch (err) {
          setError("Failed to fetch user profile after Google authentication.");
        } finally {
          window.removeEventListener("message", handleMessage);
        }
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await signupUser({
        name: String(name),
        email: String(email),
        password: String(password)
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => onSwitchToLogin(), 1500);
      } else {
        setError(res.message || "Could not create account. Try again.");
      }
    } catch (err: unknown) {
      setError("Could not create account. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Heading */}
      <h2 className="text-[22px] font-medium tracking-tight text-[#1c1b1d] dark:text-white leading-tight">
        Create your account
      </h2>
      <p className="text-[13px] text-[#787582] mt-1 mb-6">
        Start building with your team today
      </p>

      {/* Error / Success */}
      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-[13px]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2.5 rounded-md bg-[#86f2e4]/30 border border-[#006a61]/20 text-[#006a61] text-[13px]">
          Account created! Redirecting to login…
        </div>
      )}

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-[#251b72] dark:focus:border-[#c5c0ff] transition-colors"
        />

        <input
          type="email"
          value={email}
          placeholder="Work email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-[#251b72] dark:focus:border-[#c5c0ff] transition-colors"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            className="w-full h-10 px-3 pr-10 text-sm text-[#1c1b1d] dark:text-white placeholder:text-[#787582] bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 rounded-[4px] focus:outline-none focus:border-[#251b72] dark:focus:border-[#c5c0ff] transition-colors"
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

      {/* Terms notice */}
      <p className="text-[11px] text-[#787582] mt-3 mb-6 leading-relaxed">
        By creating an account you agree to our{" "}
        <button className="text-[#006a61] hover:underline cursor-pointer">Terms of Service</button> and{" "}
        <button className="text-[#006a61] hover:underline cursor-pointer">Privacy Policy</button>.
      </p>

      {/* Primary CTA */}
      <button
        onClick={handleSignup}
        disabled={isLoading || success}
        className="w-full h-11 flex items-center justify-center gap-2 bg-[#251b72] hover:bg-[#3c3489] text-white text-sm font-medium rounded-[4px] transition-colors active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Get started <ArrowRight size={15} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#c8c4d3] dark:bg-slate-700" />
        <span className="text-[12px] text-[#787582]">or</span>
        <div className="flex-1 h-px bg-[#c8c4d3] dark:bg-slate-700" />
      </div>

      {/* Google SSO */}
      <button
        onClick={handleGoogleLogin}
        className="w-full h-11 flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 border border-[#c8c4d3] dark:border-slate-600 hover:bg-[#f0edf0] dark:hover:bg-slate-800 text-[#1c1b1d] dark:text-white text-sm font-medium rounded-[4px] transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}