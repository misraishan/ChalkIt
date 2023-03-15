import Image from "next/image";
import { type Session } from "next-auth";
import { useCallback, useContext, useMemo, useState } from "react";
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
import UserContext from "~/contexts/UserContext";

enum NewType {
  folder = "folder",
  note = "note",
  null = "null",
}

export default function SideFileSystem({
  session,
  handleNewNote,
  handleNewFolder,
}: {
  session: Session;
  handleNewNote: (name: string, folderId: string | null) => void;
  handleNewFolder: (name: string, parentId: string | null) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [newType, setType] = useState("" as NewType);
  const user = useContext(UserContext);

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

  const createNew = useCallback(() => {
    if (newType === NewType.folder) {
      const parentId =
        router.query.folderId && (router.query.folderId[0] as string | null);
      if (parentId !== "home" && parentId !== undefined) {
        handleNewFolder(name, parentId);
      } else {
        handleNewFolder(name, null);
      }
    } else if (newType === NewType.note) {
      const folderId =
        router.query.folderId && (router.query.folderId[0] as string | null);
      if (folderId !== "home" && folderId !== undefined) {
        handleNewNote(name, folderId);
      } else {
        handleNewNote(name, null);
      }
    }
    toggleVisible({ type: NewType.null });
  }, [
    handleNewFolder,
    handleNewNote,
    name,
    newType,
    router.query.folderId,
    toggleVisible,
  ]);

  const [flatList, setFlatList] = useState<TreeNode[]>([]);
  useMemo(() => {
    if (user) {
      const flatList = user.folders?.map((folder) => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        type: "folder",
        children: null,
      }));
      const notes = user.notes?.map((note) => ({
        id: note.id,
        name: note.name,
        parentId: note.folderId,
        type: "note",
        children: null,
      }));
      setFlatList([...(flatList || []), ...(notes || [])]);
    }
  }, [user]);

  const tree = buildFileTree(flatList);

  return (
    <div className="w-1/5">
      <div className="flex h-screen flex-col">
        <div className="flex flex-row items-center p-4">
          <div className="avatar">
            <div className="mask mask-circle h-14 w-14">
              <Image
                src={session?.user.image || ""}
                width={56}
                height={56}
                alt={"Profile Picture"}
              />
            </div>
          </div>
          <div className="mx-2 justify-start text-start text-xl">
            {user.userId}
          </div>
        </div>

        <div className="flex flex-row justify-center children:mx-2">
          <Link href={"/home"} className="mx-2">
            <Button
              color="ghost"
              className="border-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <HiOutlineHome size={24} />
            </Button>
          </Link>
          <Button
            color="ghost"
            onClick={() => toggleVisible({ type: NewType.note })}
            className="mx-2 border border-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <HiOutlineDocumentAdd size={24} />
          </Button>
          <Button
            color="ghost"
            onClick={() => toggleVisible({ type: NewType.folder })}
            className="mx-2 border border-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <HiOutlineFolderAdd size={24} />
          </Button>
        </div>
        <div className="flex flex-row justify-center children:m-2">
          <Link href={"/shared"}>
            <Button
              color="ghost"
              className="border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Shared
            </Button>
          </Link>
          <Link href={"/favorites"}>
            <Button
              color="ghost"
              className="border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Favorites
            </Button>
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
    </div>
  );
}
