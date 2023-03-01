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

      const parent = await ctx.prisma.folders.findUnique({ where: { id: input.id } });

      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session?.user.id !== parent?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return folder;
    });
}
