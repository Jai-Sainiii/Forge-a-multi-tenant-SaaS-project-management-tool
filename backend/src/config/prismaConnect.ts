import { prisma } from "../lib/prisma.js";

export const prismaConnect = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully!");
    } catch (error) {
        console.error("Error connecting to Prisma:", error);
    }
};

export const prismaDisconnect = async () => {
    try {
        await prisma.$disconnect();
        console.log("Prisma disconnected successfully!");
    } catch (error) {
        console.error("Error disconnecting from Prisma:", error);
    }
};