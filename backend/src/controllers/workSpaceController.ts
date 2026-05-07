import { prisma } from "../lib/prisma.js";
import { type Request, type Response } from "express";

export const createWorkSpace = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const workspace = await prisma.workspace.create({
      data: {
        userId: user.id,
        title: req.body.title,
        companyname: req.body.companyname,
        describtion: req.body.describtion,
        visibility: req.body.visibility,
      },
    });

    res.json({ success: true, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllWorkSpace = async (req: Request, res: Response) => {
  try {
    const workspace = await prisma.workspace.findMany({
        where: {
            visibility: "public",
        },
    });
    res.json({ success: true, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getWorkSpace = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        const workspace = await prisma.workspace.findMany({
            where: {
                userId: user.id,
            },
        });
        res.json({ success: true, workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};