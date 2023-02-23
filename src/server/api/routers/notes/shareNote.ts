import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function shareNote() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.findUnique({
        where: { id: input.id },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session?.user.id !== note?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.shared.create({
        data: {
          noteId: input.id,
          userId: input.userId,
        },
      });
    });
}
