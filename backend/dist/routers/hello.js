import { router } from "../trpc";
import { publicProcedure } from "../trpc";
export const helloRouter = router({
    sayHello: publicProcedure.query(() => {
        return "Hello World";
    })
});
