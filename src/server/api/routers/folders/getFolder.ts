import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function getFolder() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const folder = await ctx.prisma.folders.findUnique({
        where: { id: input.id },
        include: {
          _count: { select: { notes: true } },
          notes: { orderBy: { name: "asc" } },
        },
      });

      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session?.user.id !== folder?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return folder;
    });
}
