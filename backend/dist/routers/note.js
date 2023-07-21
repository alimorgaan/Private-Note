"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRouter = void 0;
const trpc_1 = require("../trpc");
const isAuth_1 = require("../middlewares/isAuth");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const trpc_2 = require("../trpc");
const server_1 = require("@trpc/server");
const protectedProcedure = trpc_2.publicProcedure.use(isAuth_1.isAuth);
exports.noteRouter = (0, trpc_1.router)({
    createNote: protectedProcedure
        .input(zod_1.z.object({
        title: zod_1.z.string(),
        content: zod_1.z.string()
    })).mutation(async ({ input, ctx }) => {
        const newNote = await db_1.default.note.create({
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
        .query(async ({ ctx }) => {
        const notes = await db_1.default.note.findMany({
            where: {
                user: {
                    username: ctx.user.username
                }
            }
        });
        return notes;
    }),
    isNoteRead: trpc_2.publicProcedure.input(zod_1.z.object({ noteId: zod_1.z.string() })).query(async ({ input }) => {
        const note = await db_1.default.note.findUnique({
            where: {
                id: input.noteId
            }
        });
        if (!note)
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Note not found'
            });
        return note.read;
    }),
    getNote: trpc_2.publicProcedure
        .input(zod_1.z.object({ noteId: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        const note = await db_1.default.note.findUnique({
            where: {
                id: input.noteId
            }
        });
        if (!note)
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Note not found'
            });
        if (note.read) {
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'message has been read already'
            });
        }
        note.read = true;
        await db_1.default.note.update({
            where: {
                id: input.noteId
            },
            data: {
                read: true
            }
        });
        return note;
    }),
    deleteNote: protectedProcedure.input(zod_1.z.object({ noteId: zod_1.z.string() })).mutation(async ({ input, ctx }) => {
        const username = ctx.user.username;
        try {
            await db_1.default.note.delete({
                where: {
                    id: input.noteId,
                    username: username
                }
            });
            return { success: true };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'NO ACCESS TO DELETE THIS NOTE'
            });
        }
    })
});
