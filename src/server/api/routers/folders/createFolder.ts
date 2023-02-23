import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export default function createFolder() {
  return protectedProcedure
    .input(
      z.object({
        name: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const folder = await ctx.prisma.folders.create({
        data: {
          name: input.name,
          userId: ctx.session?.user.id,
          parentId: input.parentId,
        },
      });

      return folder;
    });
}
