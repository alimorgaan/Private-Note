"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("./routers");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_2 = require("@trpc/server/adapters/express");
//import { renderTrpcPanel } from "trpc-panel";
const trpc_1 = require("./trpc");
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/trpc', (0, express_2.createExpressMiddleware)({
    router: routers_1.appRouter,
    createContext: trpc_1.createContext,
}));
// for testing api in browser
/*
app.use("/panel", (_, res) => {
    return res.send(
        renderTrpcPanel(appRouter, { url: `http://localhost:${process.env.PORT}/trpc` })
    );
});
*/
app.get("/helloWorld", (req, res) => {
    res.json({ message: "Hello World" });
});
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});
exports.default = app; // for vercel serverless functions
//# sourceMappingURL=index.js.map