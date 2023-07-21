"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("../trpc");
const db_1 = __importDefault(require("../db"));
const trpc_2 = require("../trpc");
const zod_1 = require("zod");
const bcrypt_1 = require("bcrypt");
const server_1 = require("@trpc/server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userRouter = (0, trpc_1.router)({
    login: trpc_2.publicProcedure
        .input(zod_1.z.object({ username: zod_1.z.string(), password: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        const user = await db_1.default.user.findUnique({
            where: {
                username: input.username
            }
        });
        if (!user)
            throw new server_1.TRPCError({
                message: "user not found",
                code: "BAD_REQUEST"
            });
        const isMatch = await (0, bcrypt_1.compare)(input.password, user.password);
        if (!isMatch)
            throw new server_1.TRPCError({
                message: "wrong password",
                code: "BAD_REQUEST"
            });
        const payload = {
            username: user.username
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY);
        return token;
    }),
    signup: trpc_2.publicProcedure
        .input(zod_1.z.object({ username: zod_1.z.string(), password: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        const salt = await (0, bcrypt_1.genSalt)();
        const hashedPassword = await (0, bcrypt_1.hash)(input.password, salt);
        const newUser = await db_1.default.user.create({
            data: {
                username: input.username,
                password: hashedPassword
            }
        });
        if (!newUser)
            throw new server_1.TRPCError({
                message: "something went wrong",
                code: "INTERNAL_SERVER_ERROR"
            });
        const payload = {
            username: newUser.username
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY);
        return token;
    })
});
