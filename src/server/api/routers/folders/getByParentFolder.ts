import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function getByParentFolder() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const folder = await ctx.prisma.folders.findMany({
        where: { parentId: input.id },
        include: {
          _count: { select: { notes: true } },
        },
      });

      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session?.user.id !== folder[0]?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return folder;
    });
}
