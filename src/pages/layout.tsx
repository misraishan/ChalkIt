import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import SideFileSystem from "./components/SideFileSystem";
import UserContext from "./UserContext";
import { useRouter } from "next/router";
import { Alert, Toast } from "react-daisyui";
import Loading from "./components/handlerComponents/Loading";

enum ToastType {
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

  const { data, isLoading, isError } = api.users.getUser.useQuery({
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
  }, [data, isLoading]);

  const {
    mutate: createFolder,
    isLoading: isCreateFolderLoading,
    isSuccess: isFolderSuccess,
  } = api.folders.createFolder.useMutation();
  const {
    mutate: createNote,
    isLoading: isCreateNoteLoading,
    isSuccess: isNoteSuccess,
  } = api.notes.createNote.useMutation();

  useEffect(() => {
    if (isCreateFolderLoading || isCreateNoteLoading) {
      setToast({
        show: true,
        message: "Creating...",
        type: ToastType.Info,
      });
    }
    if (isNoteSuccess || isFolderSuccess) {
      setToast({
        show: true,
        message: "Created successfully!",
        type: ToastType.Success,
      });
    }
    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: ToastType.Info,
      });
    }, 3000);
  }, [
    isNoteSuccess,
    isFolderSuccess,
    isCreateFolderLoading,
    isCreateNoteLoading,
  ]);

  const handleCreateFolder = (name: string) => {
    const parentId = router.query.folderId
      ? router.query.folderId[router.query.folderId.length - 1]
      : null;
    createFolder({
      name: name,
      parentId,
    });
  };

  const handleCreateNote = (name: string) => {
    const folderId = router.query.folderId
      ? router.query.folderId[router.query.folderId.length - 1]
      : null;
    createNote({
      name: name,
      folderId,
    });
  };

  const values = {
    folders,
    setFolders,
    notes,
    setNotes,
  };

  return (
    <UserContext.Provider value={values}>
      {isLoading || isError && <Loading />}
      <div className="flex h-screen flex-row">
        {session && notes && folders && user && (
          <SideFileSystem
            user={user}
            session={session}
            handleNewFolder={(name) => handleCreateFolder(name)}
            handleNewNote={(name) => handleCreateNote(name)}
          />
        )}
        <div className="w-0.5 bg-accent"></div>
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
