import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { prismaConnect } from "./config/prismaConnect.js";
import authRoutes from "./routes/authRoutes.js";
import checkRoute from "./routes/checkRoute.js";
import workSpaceRoutes from "./routes/workSpaceRoutes.js";
import dashBoardRoutes from "./routes/dashBoardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();
const app = express();

const PORT: string = process.env.PORT as string;
const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/check", checkRoute);
app.use("/workspace", workSpaceRoutes);
app.use("/dashboard", dashBoardRoutes);
app.use("/project", projectRoutes);

prismaConnect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});