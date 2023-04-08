import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Button, Modal } from "react-daisyui";
import {
  HiOutlineFolderAdd,
  HiOutlineDocumentAdd,
  HiOutlineHome,
} from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
import { buildFileTree, type TreeNode } from "../helpers/buildFileTree";
import FileTree from "./FileTree";
import { ToastType } from "../layout";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Alert, Toast } from "react-daisyui";
import type { Folders, Notes } from "@prisma/client";

enum NewType {
  folder = "folder",
  note = "note",
  null = "null",
}

export default function SideFileSystem({
  userInfo,
}: {
  userInfo: {
    folders: Folders[] | null | undefined;
    setFolders: (folders: Folders[] | null | undefined) => void;
    notes: Notes[] | null | undefined;
    setNotes: (notes: Notes[] | null | undefined) => void;
    userId: string | null | undefined;
    setUserId: (userId: string | null | undefined) => void;
  };
}) {
  const session = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [newType, setType] = useState("" as NewType);
  const user = api.users.getUser.useQuery({
    id: session?.data?.user.id as string,
  }).data;

  const { folders, setFolders, notes, setNotes, userId } = userInfo;

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info,
  });
  const toggleVisible = useCallback(
    ({ type }: { type: NewType }) => {
      if (type === NewType.null) {
        setVisible(!visible);
        setType(type);
        return;
      }
      setVisible(!visible);
      setType(type);
    },
    [visible]
  );

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

  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null) => {
      void newFolder
        .mutateAsync({
          name,
          parentId,
        })
        .then((res) => {
          if (res) {
            updateToast("Folder created", ToastType.Success);
            setFolders(folders ? [...folders, res] : [res]);
          }
        });
      updateToast("Creating folder...", ToastType.Info);
    },
    [folders, newFolder, setFolders]
  );

  const handleCreateNote = useCallback(
    (name: string, folderId: string | null) => {
      void newNote
        .mutateAsync({
          name,
          folderId,
        })
        .then((res) => {
          if (res) {
            updateToast("Note created", ToastType.Success);
            setNotes(notes ? [...notes, res] : [res]);
          }
        });

      updateToast("Creating...", ToastType.Info);
    },
    [newNote, notes, setNotes]
  );

  const createNew = useCallback(() => {
    if (newType === NewType.folder) {
      const parentId =
        router.query.folderId && (router.query.folderId[0] as string | null);
      if (parentId !== "home" && parentId !== undefined) {
        handleCreateFolder(name, parentId);
      } else {
        handleCreateFolder(name, null);
      }
    } else if (newType === NewType.note) {
      const folderId =
        router.query.folderId && (router.query.folderId[0] as string | null);
      if (folderId !== "home" && folderId !== undefined) {
        handleCreateNote(name, folderId);
      } else {
        handleCreateNote(name, null);
      }
    }
    toggleVisible({ type: NewType.null });
  }, [
    handleCreateFolder,
    handleCreateNote,
    name,
    newType,
    router.query.folderId,
    toggleVisible,
  ]);

  const [flatList, setFlatList] = useState<TreeNode[]>([]);
  useMemo(() => {
    if (folders || notes) {
      const flatList = folders?.map((folder) => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        type: "folder",
        children: null,
      }));
      const flatNotes = notes?.map((note) => ({
        id: note.id,
        name: note.name,
        parentId: note.folderId,
        type: "note",
        children: null,
      }));
      setFlatList([...(flatList || []), ...(flatNotes || [])]);
    }
  }, [folders, notes]);

  const tree = buildFileTree(flatList);

  return user ? (
    <div className="w-1/7 neu-card">
      <div className="flex h-screen flex-col">
        <div className="flex flex-row items-center p-4">
          <div className="avatar">
            <div className="mask mask-circle h-14 w-14">
              <Image
                src={session?.data?.user.image || ""}
                width={56}
                height={56}
                alt={"Profile Picture"}
              />
            </div>
          </div>
          <div className="mx-2 justify-start text-start text-xl">{userId}</div>
        </div>

        <div className="flex flex-row justify-center children:mx-2">
          <Link href={"/home"} className="mx-2">
            <Button color="ghost">
              <HiOutlineHome size={24} />
            </Button>
          </Link>
          <Button
            color="ghost"
            onClick={() => toggleVisible({ type: NewType.note })}
            className="mx-2 "
          >
            <HiOutlineDocumentAdd size={24} />
          </Button>
          <Button
            color="ghost"
            onClick={() => toggleVisible({ type: NewType.folder })}
            className="mx-2"
          >
            <HiOutlineFolderAdd size={24} />
          </Button>
        </div>
        <div className="flex flex-row justify-center children:m-2">
          <Link href={"/shared"}>
            <Button color="ghost">Shared</Button>
          </Link>
          <Link href={"/favorites"}>
            <Button color="ghost">Favorites</Button>
          </Link>
        </div>

        <h2 className="ml-2 text-2xl">All Files</h2>
        <div className="justify-center overflow-x-auto overflow-y-auto">
          {tree && <FileTree fileTree={tree} />}
        </div>
      </div>

      <Modal
        open={visible}
        onClickBackdrop={() =>
          toggleVisible({
            type: NewType.null,
          })
        }
      >
        <Modal.Header>Create {newType}</Modal.Header>
        <Modal.Body>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder={`Name of ${newType}`}
              className="input-bordered input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Actions>
          <button className="btn-primary btn" onClick={() => createNew()}>
            Create
          </button>
        </Modal.Actions>
      </Modal>
      {toast.show && (
        <Toast vertical="bottom" horizontal="end">
          <Alert status={toast.type}>{toast.message}</Alert>
        </Toast>
      )}
    </div>
  ) : (
    <></>
  );
}
