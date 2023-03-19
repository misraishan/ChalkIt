import { createTRPCRouter } from "~/server/api/trpc";
import deleteUser from "./users/deleteUser";
import getAllUsers from "./users/getAllUsers";
import getUser from "./users/getUser";
import updateUser from "./users/updateUser";

export const usersRouter = createTRPCRouter({
  getUser: getUser(),
  getAllUsers: getAllUsers(),
  deleteUser: deleteUser(),
  updateUser: updateUser(),
});
