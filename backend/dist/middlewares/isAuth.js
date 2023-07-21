"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
exports.isAuth = (0, trpc_1.middleware)(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user) {
        throw new server_1.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to do this'
        });
    }
    else {
        return opts.next({
            ctx: {
                user: ctx.user
            }
        });
    }
});
//# sourceMappingURL=isAuth.js.map