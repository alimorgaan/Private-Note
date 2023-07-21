"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloRouter = void 0;
const trpc_1 = require("../trpc");
const trpc_2 = require("../trpc");
exports.helloRouter = (0, trpc_1.router)({
    sayHello: trpc_2.publicProcedure.query(() => {
        return "Hello World";
    })
});
