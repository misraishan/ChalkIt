import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export default function deleteUser() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.session.user.id) {
        return ctx.prisma.user.delete({
          where: {
            id: input.id,
          },
        });
      }
    });
}
