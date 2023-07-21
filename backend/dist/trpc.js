"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProcedure = exports.middleware = exports.router = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const createContext = async (opts) => {
    try {
        const req = opts.req;
        const token = req.headers.token;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        return { user: decoded };
    }
    catch (e) {
        return { user: null };
    }
};
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.middleware = t.middleware;
exports.publicProcedure = t.procedure;
//# sourceMappingURL=trpc.js.map