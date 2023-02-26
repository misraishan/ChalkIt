import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function updateNote() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        fullRead: z.boolean().optional(),
        fullWrite: z.boolean().optional(),
        folderId: z.string().optional().nullable(),
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

      await ctx.prisma.notes.update({
        where: { id: input.id },
        data: {
          name: input.name,
          fullRead: input.fullRead,
          fullWrite: input.fullWrite,
        },
      });
    });
}
