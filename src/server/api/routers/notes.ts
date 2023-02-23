import { createTRPCRouter } from "../trpc";
import deleteNote from "./notes/deleteNote";
import getNote from "./notes/getNote";
import shareNote from "./notes/shareNote";
import unshareNote from "./notes/unshareNote";
import updateNote from "./notes/updateNote";

export const notesRouter = createTRPCRouter({
    getNote: getNote(),
    deleteNote: deleteNote(),
    unshareNote: unshareNote(),
    shareNote: shareNote(),
    updateNote: updateNote(),
});
