import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

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
        
        const newUser = await prisma.user.create({data: {name, email, password: hashedpassword}});
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }
        
        const token: string = jwt.sign(
            { id: newUser.id, email: newUser.email }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({message: "Signup Successfull", user: {name: newUser.name, email: newUser.email}});

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

        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }

        const token: string = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login Successfull", user: {name: user.name, email: user.email} });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
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
        const token: string | undefined = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if(!JWT_SECRET){
            return res.status(500).json({message: "JWT_SECRET is not defined"});
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);

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
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: googleUser.sub },
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    name: googleUser.name || "Google User",
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    password: null, 
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
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
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
                        window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS" }, "${FRONTEND_URL}");
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
