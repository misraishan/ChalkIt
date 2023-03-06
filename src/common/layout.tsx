import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import SideFileSystem from "./components/SideFileSystem";
import UserContext from "../contexts/UserContext";
import { useRouter } from "next/router";
import { Alert, Breadcrumbs, Toast } from "react-daisyui";
import Loading from "./components/handlerComponents/Loading";

export enum ToastType {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info || undefined,
  });
  const { data: session } = useSession({
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
  const [parents, setParents] = useState([] as Folders[] | null);

  const { data, isLoading, isError } = api.users.getUser.useQuery({
    id: session?.user.id as string,
  });

  const [user, setUser] = useState(data);

  useEffect(() => {
    console.log("Got data");
    if (data) {
      setUser(data);
      setFolders(data.folders);
      setNotes(data.notes);
    }
  }, [data]);

  const newFolder = api.folders.createFolder.useMutation();
  const newNote = api.notes.createNote.useMutation();

  const updateToast = (message: string, type: ToastType) => {
    setToast({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: ToastType.Info,
      });
    }, 3000);
  };

  const handleCreateFolder = (name: string) => {
    const parentId = router.query.folderId
      ? router.query.folderId[router.query.folderId.length - 1]
      : null;
    newFolder.mutate({
      name: name,
      parentId,
    });
    updateToast("Folder created", ToastType.Success);
  };

  const handleCreateNote = (name: string) => {
    const folderId = router.query.folderId
      ? router.query.folderId[router.query.folderId.length - 1]
      : null;
    newNote.mutate({
      name: name,
      folderId,
    });
    updateToast("Note created", ToastType.Success);
  };

  const values = {
    folders,
    setFolders,
    notes,
    setNotes,
  };

  return (
    <UserContext.Provider value={values}>
      {isLoading || (isError && <Loading />)}
      <div className="flex h-screen flex-row">
        {session && notes && folders && user && (
          <>
            <SideFileSystem
              user={user}
              session={session}
              handleNewFolder={(name) => handleCreateFolder(name)}
              handleNewNote={(name) => handleCreateNote(name)}
            />
            <div className="w-0.5 bg-accent"></div>
          </>
        )}
        <div className="w-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        {toast.show && (
          <Toast vertical="bottom" horizontal="end">
            <Alert status={toast.type}>{toast.message}</Alert>
          </Toast>
        )}
      </div>
    </UserContext.Provider>
  );
}
