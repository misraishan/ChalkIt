import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export default function getUser() {
  return publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const isUser = ctx.session?.user.id === input.id;
      let user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
          userId: input.userId,
          id: input.id,
        },
        select: {
          name: true,
          userId: true,
          folders: isUser ? true : false,
          notes: isUser ? true : false,
          shared: isUser ? true : false,
        },
      });

      if (!user?.userId && isUser) {
        const userId = generateUserId(user?.name || "User");
        user = await ctx.prisma.user.update({
          where: { id: input.id },
          data: { userId },
          select: {
            name: true,
            userId: true,
            folders: true,
            notes: true,
            shared: true,
          },
        });
      }

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return user;
    });
}

function generateUserId(username: string) {
  return (
    username +
    "#" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  );
}
