import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc'


export const isAuth = middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to do this'
        })
    } else {
        return opts.next({
            ctx: {
                user: ctx.user as { username: string }
            }
        });
    }
}); 