import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function shareNote() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        write: z.boolean().or(z.undefined()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.findUnique({
        where: { id: input.id },
        include: { user: true },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session?.user.id !== note?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { userId: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.shared.create({
        data: {
          noteId: input.id,
          userId: user.id,
          write: input.write,
        },
      });
    });
}
