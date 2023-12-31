
import { appRouter } from './routers/index';
import cors from 'cors';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
//import { renderTrpcPanel } from "trpc-panel";
import { createContext } from './trpc';
import 'dotenv/config';


const app: express.Application = express();


app.use(cors());


app.use('/trpc', createExpressMiddleware({
    router: appRouter,
    createContext,
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

export type AppRouter = typeof appRouter;
export default app ; // for vercel serverless functions
