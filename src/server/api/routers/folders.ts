import { createTRPCRouter } from "../trpc";
import createFolder from "./folders/createFolder";
import deleteFolder from "./folders/deleteFolder";
import getFolder from "./folders/getFolder";
import updateFolder from "./folders/updateFolder";

export const foldersRouter = createTRPCRouter({
    createFolder: createFolder(),
    getFolder: getFolder(),
    deleteFolder: deleteFolder(),
    updateFolder: updateFolder(),
});