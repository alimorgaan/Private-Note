import { router } from "../trpc";
import { isAuth } from "../middlewares/isAuth";
import { z } from "zod";
import prisma from "../db";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";


const protectedProcedure = publicProcedure.use(isAuth);

export const noteRouter = router({
    createNote: protectedProcedure
        .input(z.object({
            title: z.string(),
            content: z.string()
        })).mutation(async ({ input, ctx }) => {
            const newNote = await prisma.note.create({
                data: {
                    title: input.title,
                    content: input.content,
                    user: {
                        connect: {
                            username: ctx.user.username
                        }
                    }
                }
            });

            return newNote;
        }),

    getUserNotes: protectedProcedure
        .query(async ({  ctx }) => {
            const notes = await prisma.note.findMany({
                where: {
                    user: {
                        username: ctx.user.username
                    }
                }
            });

            return notes;
        }),

    
    isNoteRead : publicProcedure.input(z.object({noteId: z.string()})).query(async ({input}) => {
        const note = await prisma.note.findUnique({
            where: {
                id: input.noteId
            }
        });
        if (!note) throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found'
        });
        
        return note.read;
    }),

    getNote: publicProcedure
        .input(z.object({ noteId: z.string() }))
        .mutation(async ({ input }) => {
            const note = await prisma.note.findUnique({
                where: {
                    id: input.noteId
                }
            });
            if (!note) throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Note not found'
            });

            if (note.read) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'message has been read already'
                });
            }

            note.read = true;
            await prisma.note.update({
                where: {
                    id: input.noteId
                },
                data: {
                    read: true
                }
            });

            return note;
        }),

        deleteNote : protectedProcedure.input(z.object({noteId: z.string()})).mutation(async ({input ,ctx}) => {
            const username = ctx.user.username;
            
            try {
                await prisma.note.delete({
                    where: {
                        id: input.noteId , 
                        username : username
                    }
                });
                return { success: true };
            }catch(error){
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'NO ACCESS TO DELETE THIS NOTE'
                });
            }
        }
        )

});