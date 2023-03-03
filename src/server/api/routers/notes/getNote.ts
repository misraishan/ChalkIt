import { publicProcedure } from "../../trpc";
import { z } from "zod";

export default function getNote() {
  return publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.findUnique({
        where: { id: input.id },
        include: { shared: true },
      });

      if (note?.userId === ctx.session?.user.id) {
        return note;
      }

      if (note?.fullRead === true) {
        return note;
      }
      note?.shared.forEach((shared) => {
        if (shared.userId === ctx.session?.user.id) {
          return note;
        }
      });
    });
}
