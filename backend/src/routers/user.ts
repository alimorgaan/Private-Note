import { router } from "../trpc";
import prisma from "../db";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { genSalt, compare, hash } from "bcrypt";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

export const userRouter = router({
    login: publicProcedure
        .input(z.object({ username: z.string().min(2).max(100), password: z.string().min(2).max(100) }))
        .mutation(async ({ input }) => {
            const user = await prisma.user.findUnique({
                where: {
                    username: input.username
                }
            })
            if (!user) throw new TRPCError({
                message: "user not found",
                code: "BAD_REQUEST"
            });
            const isMatch = await compare(input.password, user.password);
            if (!isMatch) throw new TRPCError({
                message: "wrong password",
                code: "BAD_REQUEST"
            });
            const payload = {
                username: user.username
            }
            const token = jwt.sign(payload, process.env.SECRET_KEY as string);
            return token;
        }),
        
    signup: publicProcedure
        .input(z.object({ username: z.string().min(2).max(100), password: z.string().min(2).max(100) }))
        .mutation(async ({ input }) => {

            const salt = await genSalt();
            const hashedPassword = await hash(input.password, salt);
            try {
                const newUser = await prisma.user.create({
                    data: {
                        username: input.username,
                        password: hashedPassword
                    }
                })
                const payload = {
                    username: newUser.username
                }
                const token = jwt.sign(payload, process.env.SECRET_KEY as string);
                return token;

            }catch(error){
                throw new TRPCError({
                    message: "username already used try another one :)",
                    code: "BAD_REQUEST"
                });
            }
            

            

        })
}); 