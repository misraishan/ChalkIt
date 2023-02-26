import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function createNote() {
  return protectedProcedure
    .input(
      z.object({
        name: z.string(),
        folderId: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.create({
        data: {
          name: input.name,
          userId: ctx.session?.user.id,
          folderId: input.folderId,
        },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return note;
    });
}
