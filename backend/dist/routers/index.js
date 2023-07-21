"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const hello_1 = require("./hello");
const note_1 = require("./note");
const user_1 = require("./user");
exports.appRouter = (0, trpc_1.router)({
    hello: hello_1.helloRouter,
    user: user_1.userRouter,
    note: note_1.noteRouter
});
