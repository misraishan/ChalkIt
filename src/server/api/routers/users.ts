import { createTRPCRouter } from "~/server/api/trpc";
import deleteUser from "./users/deleteUser";
import getUser from "./users/getUser";
import updateUser from "./users/updateUser";

export const usersRouter = createTRPCRouter({
  getUser: getUser(),
  deleteUser: deleteUser(),
  updateUser: updateUser(),
});
