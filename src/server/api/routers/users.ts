import { createTRPCRouter } from "~/server/api/trpc";
import deleteUser from "./users/deleteUser";
import getUser from "./users/getOne";

export const usersRouter = createTRPCRouter({
  getUser: getUser(),
  deleteUser: deleteUser(),
});
