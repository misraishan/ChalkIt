import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export default function updateUser() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.session.user.id) {
        return ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            userId: input.userId,
          },
        });
      } 

      return null;
    });
}
