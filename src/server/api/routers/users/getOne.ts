import { publicProcedure } from "../../trpc";
import { z } from "zod";

enum QueryType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
}

export default function getUser() {
  return publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum([QueryType.FULL, QueryType.PARTIAL]),
        email: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (input.type === QueryType.FULL) {
        return ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
      }

      return ctx.prisma.user.findUnique({
        where: {
          email: input.email,
          userId: input.userId,
        },
        select: {
          name: true,
        },
      });
    });
}
