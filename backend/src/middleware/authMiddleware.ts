import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOtpEmail } from "../utils/mailer.js";

dotenv.config();

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signup = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await prisma.user.findUnique({where: {email: email}});

        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedpassword: string = await bcrypt.hash(password, 10);
        
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedpassword,
                isVerified: false,
                otpCode: otp,
                otpExpires: otpExpires
            }
        });

        await sendOtpEmail(email, otp, 'signup');

        res.json({
            message: "Signup successful. Verification OTP sent to email.",
            requiresVerification: true,
            email: newUser.email
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account was registered using Google. Please log in with Google." });
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Check verification status
        if (!user.isVerified) {
            const otp = generateOtp();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.user.update({
                where: { email },
                data: {
                    otpCode: otp,
                    otpExpires
                }
            });

            await sendOtpEmail(email, otp, 'signup');

            return res.status(403).json({
                message: "Account not verified. A verification OTP has been sent to your email.",
                requiresVerification: true,
                email: user.email
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }

        const token: string = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login Successfull", user: {id: user.id, name: user.name, email: user.email} });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and OTP code are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        if (!user.otpCode || !user.otpExpires) {
            return res.status(400).json({ message: "No active verification code found. Please request a new one." });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Verification code expired. Please request a new one." });
        }

        if (user.otpCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otpCode: null,
                otpExpires: null
            }
        });

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not defined" });
        }

        const token: string = jwt.sign(
            { id: updatedUser.id, email: updatedUser.email },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Email verified successfully. Welcome!",
            user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: {
                otpCode: otp,
                otpExpires
            }
        });

        await sendOtpEmail(email, otp, 'signup');

        res.json({ message: "Verification OTP has been resent successfully." });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return success anyway to prevent user enumeration
            return res.json({ message: "If that email exists in our system, we've sent an OTP to reset your password." });
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account was registered using Google. Please log in with Google." });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: {
                resetOtpCode: otp,
                resetOtpExpires: otpExpires
            }
        });

        await sendOtpEmail(email, otp, 'reset');

        res.json({ message: "Password reset OTP sent to your email." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "Email, OTP code, and new password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resetOtpCode || !user.resetOtpExpires) {
            return res.status(400).json({ message: "No active password reset request found." });
        }

        if (user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: "Password reset code expired. Please request a new one." });
        }

        if (user.resetOtpCode !== code) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedpassword,
                resetOtpCode: null,
                resetOtpExpires: null,
                isVerified: true
            }
        });

        res.json({ message: "Password reset successfully. You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 0
        });
        res.json({ message: "Logout Successfull" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = await req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as any;

        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
        if (!user || !user.isVerified) {
            return res.status(403).json({ message: "Account not verified. Please verify your email first." });
        }

        if (!req.body) {
            req.body = {};
        }
        req.body.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Signin or Login expired" });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const token: string | undefined = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }

        const decodedToken: any = jwt.verify(token, JWT_SECRET);

        if(decodedToken.expiresIn < Date.now()){
            return res.status(401).json({message: "Token expired"});
        }

        const user = await prisma.user.findUnique({where: {email: decodedToken.email}});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified" });
        }

        res.json({user: {name: user.name, email: user.email}});
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const googleAuthRedirect = (req: Request, res: Response) => {
    const client_id: string = process.env.GOOGLE_CLIENT_ID as string;
    const backend_base: string = process.env.BACKEND_URL as string;
    const redirect_uri = `${backend_base}/auth/google/callback`;

    if (!client_id || !redirect_uri) {
        return res.status(500).json({ message: "Google Client ID or Callback URL is not configured." });
    }
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=profile%20email&access_type=offline&prompt=select_account`;
    res.redirect(url);
};

export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Authorization code missing." });
        }

        const client_id: string = process.env.GOOGLE_CLIENT_ID as string;
        const client_secret: string = process.env.GOOGLE_CLIENT_SECRET as string;
        const backend_base: string = process.env.BACKEND_URL as string;
        const redirect_uri: string = `${backend_base}/auth/google/callback`;

        if (!client_id || !client_secret || !redirect_uri) {
            return res.status(500).json({ message: "Google OAuth credentials not configured." });
        }

        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: String(code),
                client_id,
                client_secret,
                redirect_uri,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            console.error("Token exchange failed:", errText);
            return res.status(400).json({ message: "Failed to exchange authorization code." });
        }

        const tokenData = await tokenResponse.json() as { access_token: string; id_token: string };
        const { access_token } = tokenData;

        const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userResponse.ok) {
            return res.status(400).json({ message: "Failed to fetch user info from Google." });
        }

        const googleUser = await userResponse.json() as { sub: string; name: string; email: string; picture?: string };

        if (!googleUser.email) {
            return res.status(400).json({ message: "Google account does not provide an email address." });
        }
        let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

        if (user) {
            if (!user.googleId || !user.isVerified) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { 
                        googleId: googleUser.sub,
                        isVerified: true
                    },
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    name: googleUser.name || "Google User",
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    isVerified: true,
                },
            });
        }
        
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not defined" });
        }

        const token: string = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, 
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        const FRONTEND_URL: string = process.env.FRONTEND_URL as string;
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Success</title>
            </head>
            <body>
                <script>
                    if (window.opener) {
                        window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", token: "${token}" }, "${FRONTEND_URL}");
                    }
                    window.close();
                </script>
            </body>
            </html>
        `);

    } catch (error) {
        console.error("Google OAuth error:", error);
        res.status(500).json({ message: "Internal server error during Google OAuth." });
    }
};
