import { createContext } from "react";
import { type Folders, type Notes } from "@prisma/client";

export default createContext({
  folders: null as Folders[] | null,
  setFolders: (folders: Folders[] | null) => {
    console.log("setFolders", folders);
    return;
  },
  notes: null as Notes[] | null,
  setNotes: (notes: Notes[] | null) => {
    console.log("setNotes", notes);
    return;
  },
});
