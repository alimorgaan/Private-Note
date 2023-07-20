import { router } from "../trpc";
import { helloRouter } from "./hello";
import { noteRouter } from "./note";
import { userRouter } from "./user";

export const appRouter = router({
    hello: helloRouter,
    user: userRouter,
    note: noteRouter
});



export type AppRouter = typeof appRouter;