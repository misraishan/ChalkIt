import { createContext } from "react";
import { type Folders, type Notes } from "@prisma/client";

export default createContext({
  folders: null as Folders[] | null | undefined,
  setFolders: (folders: Folders[] | null | undefined) => {
    console.log("setFolders", folders);
    return;
  },
  notes: null as Notes[] | null | undefined,
  setNotes: (notes: Notes[] | null | undefined) => {
    console.log("setNotes", notes);
    return;
  },
});
