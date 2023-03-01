import { createTRPCRouter } from "../trpc";
import createFolder from "./folders/createFolder";
import deleteFolder from "./folders/deleteFolder";
import getFolder from "./folders/getFolder";
import updateFolder from "./folders/updateFolder";
import getFolderByParent from "./folders/getByParentFolder";

export const foldersRouter = createTRPCRouter({
    createFolder: createFolder(),
    getFolder: getFolder(),
    deleteFolder: deleteFolder(),
    updateFolder: updateFolder(),
    getFolderByParent: getFolderByParent(),
});