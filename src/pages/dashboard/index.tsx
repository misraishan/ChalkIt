import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { RadialProgress } from "react-daisyui";
import { api } from "~/utils/api";
import SideFileSystem from "../components/SideFileSystem";

function generateUserId(username: string) {
  return (
    username +
    "#" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  );
}

export default function Dashboard() {
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

  const [folders, setFolders] = useState([] as Folders[]);
  const [notes, setNotes] = useState([] as Notes[]);
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
  }, [
    data,
    isLoading,
    session?.user.id,
    session?.user.name,
    user?.name,
    user?.userId,
  ]);

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
  const { mutate: createFolder } = api.folders.createFolder.useMutation();
  const { mutate: createNote } = api.notes.createNote.useMutation();

  const handleCreateFolder = () => {
    createFolder({
      name: "New Folder",
      // userId: session?.user.id as string,
    });
  };

  const handleCreateNote = () => {
    const note = createNote({
      title: "New Note",
    });

    console.log(note);
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen">
        <RadialProgress value={100} color="info"></RadialProgress>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-row">
      <SideFileSystem
        notes={notes}
        folders={folders}
        user={user}
        session={session}
        handleNewFolder={handleCreateFolder}
        handleNewNote={handleCreateNote}
      />
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Notes</h1>
          <button className="btn-primary btn" onClick={() => handleCreateNote}>
            Create Note
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {notes.map((note: Notes) => (
            <div className="flex flex-row items-center gap-4" key={note.id}>
              {/* <HiDocumentText size={24} /> */}
              {note.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
