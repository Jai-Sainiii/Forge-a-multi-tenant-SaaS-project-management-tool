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
            maxAge: 60 * 60 * 1000,
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
            maxAge: 60 * 60 * 1000,
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

        req.body.user = decodedToken;

        next();
    } catch (error) {
        console.error("Protected route error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
