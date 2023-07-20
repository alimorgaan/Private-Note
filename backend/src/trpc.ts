import { initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Request } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

export const createContext = async (opts: CreateNextContextOptions) => {
    try {
        const req: Request = opts.req;
        const token = req.headers.token;
        const decoded = jwt.verify(token as string, process.env.SECRET_KEY as string) as { username: string };
        return { user: decoded };
    } catch (e) {
        return { user: null };
    }
}

const t = initTRPC.context<typeof createContext>().create();
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;


