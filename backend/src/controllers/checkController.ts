import { type Request, type Response } from "express";

export const check = async (req: Request, res: Response) => {
    res.json({ message: "Protected route accessed successfully", user: req.body.user });
};