import { publicProcedure } from "../../trpc";
import { z } from "zod";

export default function getUser() {
  return publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {

      const isUser = ctx.session?.user.id === input.id;
        return ctx.prisma.user.findUnique({
          where: {
            email: input.email,
            userId: input.userId,
            id: input.id,
          },
          select: {
            name: true,
            userId: true,
            folders: isUser ? true : false,
            notes: isUser ? true : false,
            shared: isUser ? true : false,
          },
        });
    });
}
