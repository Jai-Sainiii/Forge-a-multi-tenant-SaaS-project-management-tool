"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BASE_URL_BACKEND;

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: token ? `token=${token}` : "",
      },
      body: JSON.stringify({}),
    });
  } catch {
    // ignore
  }

  // Clear the cookie on the Next.js side too
  (await cookies()).delete("token");
  return { success: true };
}

export async function loginUser(credentials: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Invalid credentials.",
        requiresVerification: data.requiresVerification,
        email: data.email
      };
    }

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const tokenVal = tokenMatch[1];
        (await cookies()).set("token", tokenVal, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" || true,
          sameSite: "none",
          path: "/",
          maxAge: 24 * 60 * 60,
        });
      }
    }

    return { success: true, user: data.user, message: data.message };
  } catch (err) {
    return { success: false, message: "An error occurred during login." };
  }
}

export async function signupUser(formData: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to sign up." };
    }

    return { success: true, user: data.user, message: data.message, requiresVerification: data.requiresVerification, email: data.email };
  } catch (err) {
    return { success: false, message: "An error occurred during signup." };
  }
}

export async function setTokenCookie(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
}

export async function verifyOtpAction(email: string, code: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Invalid OTP code." };
    }

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const tokenVal = tokenMatch[1];
        (await cookies()).set("token", tokenVal, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 24 * 60 * 60,
        });
      }
    }

    return { success: true, user: data.user, message: data.message };
  } catch (err) {
    return { success: false, message: "An error occurred during OTP verification." };
  }
}

export async function resendOtpAction(email: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to resend OTP." };
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "An error occurred while resending OTP." };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to request password reset." };
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "An error occurred during password reset request." };
  }
}

export async function resetPasswordAction(payload: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to reset password." };
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "An error occurred during password reset." };
  }
}
