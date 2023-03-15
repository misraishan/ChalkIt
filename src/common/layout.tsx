import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { memo, useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import SideFileSystem from "./components/SideFileSystem";
import UserContext from "../contexts/UserContext";
import { useRouter } from "next/router";
import { Alert, Toast } from "react-daisyui";
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
      if (!router.pathname.includes("/notes/")) {
        return {
          redirect: {
            destination: "/api/auth/signin",
            permanent: false,
          },
        };
      }
    },
  });

  const [folders, setFolders] = useState(null as Folders[] | null | undefined);
  const [notes, setNotes] = useState(null as Notes[] | null | undefined);

  const { data, isLoading, isError } = api.users.getUser.useQuery({
    id: session?.user.id as string,
  });

  const [user, setUser] = useState(data);

  useEffect(() => {
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

  const handleCreateFolder = (name: string, parentId: string | null) => {
    void newFolder
      .mutateAsync({
        name,
        parentId,
      })
      .then((res) => {
        if (res) {
          updateToast("Folder created", ToastType.Success);
          setFolders((prev) => {
            if (prev) {
              return [...prev, res];
            }
            return null;
          });
        }
      });
    updateToast("Creating folder...", ToastType.Info);
  };

  const handleCreateNote = (name: string, folderId: string | null) => {
    void newNote
      .mutateAsync({
        name,
        folderId,
      })
      .then((res) => {
        if (res) {
          updateToast("Note created", ToastType.Success);
          setNotes((prev) => {
            if (prev) {
              return [...prev, res];
            }
            return null;
          })
        }
      });

    updateToast("Creating...", ToastType.Info);
  };

  const values = useMemo(
    () => ({
      folders,
      setFolders,
      notes,
      setNotes,
    }),
    [folders, notes]
  );

  const MemoizedFileSystem = memo(SideFileSystem);

  return (
    <UserContext.Provider value={values}>
      {isLoading || (isError && <Loading />)}
      <div className="flex h-screen flex-row">
        {session && notes && folders && user && (
          <>
            <MemoizedFileSystem
              user={user}
              session={session}
              handleNewFolder={(name, parentId) => handleCreateFolder(name, parentId)}
              handleNewNote={(name, folderId) => handleCreateNote(name, folderId)}
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
