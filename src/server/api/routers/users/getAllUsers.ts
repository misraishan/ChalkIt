import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function getUser() {
  return publicProcedure
    .input(
      z.object({
        id: z.string().array().or(z.undefined()),
        noteId: z.string().or(z.undefined()),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.id === undefined || input.noteId === undefined) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const note = await ctx.prisma.notes.findUnique({
        where: { id: input.noteId },
      });

      const isUser = ctx.session?.user.id === note?.userId;
      if (!isUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const users = await ctx.prisma.user.findMany({
        where: {
          id: {
            in: input.id,
          },
        },
        select: {
          id: true,
          name: true,
          userId: true,
        },
      });

      return users;
    });
}
