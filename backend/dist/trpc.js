import { initTRPC } from "@trpc/server";
import jwt from "jsonwebtoken";
import 'dotenv/config';
export const createContext = async (opts) => {
    try {
        const req = opts.req;
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return { user: decoded };
    }
    catch (e) {
        return { user: null };
    }
};
const t = initTRPC.context().create();
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
