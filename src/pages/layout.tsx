import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import SideFileSystem from "./components/SideFileSystem";
import UserContext from "./UserContext";

function generateUserId(username: string) {
  return (
    username +
    "#" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    },
  });

  const [folders, setFolders] = useState([] as Folders[] | null);
  const [notes, setNotes] = useState([] as Notes[] | null);


  const { data, isLoading } = api.users.getUser.useQuery({
    id: session?.user.id as string,
  });

  const [user, setUser] = useState(data);

  useEffect(() => {
    if (isLoading) return;
    if (data) {
      setUser(data);
      setFolders(data.folders);
      setNotes(data.notes);
    }
  }, [data, isLoading, setUser]);

  const { mutate: createFolder } = api.folders.createFolder.useMutation();
  const { mutate: createNote } = api.notes.createNote.useMutation();

  const handleCreateFolder = (name: string, parentId: string | null) => {
    createFolder({
      name: name,
      parentId,
    });
  };

  const handleCreateNote = (name: string, folderId: string | null) => {
    createNote({
      name: name,
      folderId,
    });
  };

  const { mutate: updateUser } = api.users.updateUser.useMutation();
  const handleUpdateUser = () => {
    if (!user || user.userId || status !== "authenticated" || !session?.user.id)
      return;
    console.log("updating user");
    console.log(user);
    updateUser({
      id: session?.user.id,
      userId: generateUserId(user?.name?.split(" ")[0] || "User"),
    });
  };

  if (status === "authenticated") {
    if (!user?.userId) {
      handleUpdateUser();
    }
  }

  const values = {
    folders,
    setFolders,
    notes,
    setNotes,
  }

  return (
    <UserContext.Provider value={values}>
      <div className="flex h-screen flex-row">
        {session && notes && folders && user && (
          <SideFileSystem
            notes={notes}
            folders={folders}
            user={user}
            session={session}
            handleNewFolder={(name, parentId) =>
              handleCreateFolder(name, parentId)
            }
            handleNewNote={(name, folderId) => handleCreateNote(name, folderId)}
          />
        )}
        <div className="w-0.5 bg-accent"></div>
        <div className="w-full">{children}</div>
      </div>
    </UserContext.Provider>
  );
}
