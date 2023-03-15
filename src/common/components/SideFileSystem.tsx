import Image from "next/image";
import { type Shared, type Folders, type Notes } from "@prisma/client";
import { type Session } from "next-auth";
import { useState } from "react";
import { Button, Dropdown, Modal } from "react-daisyui";
import { HiFolderAdd, HiDocumentAdd } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";

enum NewType {
  folder = "folder",
  note = "note",
  null = "null",
}

export default function SideFileSystem({
  user,
  session,
  handleNewNote,
  handleNewFolder,
}: {
  user:
    | {
        notes: Notes[];
        folders: Folders[];
        shared: Shared[];
        userId: string | null;
        name: string | null;
      }
    | null
    | undefined;
  session: Session;
  handleNewNote: (name: string, folderId: string | null) => void;
  handleNewFolder: (name: string, parentId: string | null) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [newType, setType] = useState("" as NewType);

  const toggleVisible = ({ type }: { type: NewType }) => {
    if (type === NewType.null) {
      setVisible(!visible);
      setType(type);
      return;
    }
    setVisible(!visible);
    setType(type);
  };

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
            {user?.userId}
          </div>
        </div>

        <div className="flex flex-row justify-center children:mx-2">
          <Link href={"/home"}>
            <Button color="accent">Home</Button>
          </Link>
          <Dropdown hover horizontal="center">
            <Dropdown.Toggle color="secondary">New +</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => toggleVisible({ type: NewType.folder })}
              >
                <HiFolderAdd size={24} />
                Folder
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => toggleVisible({ type: NewType.note })}
              >
                <HiDocumentAdd size={24} />
                Note
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
            <button
              className="btn-primary btn"
              onClick={() => {
                console.log(name, newType);
                if (newType === NewType.folder) {
                  const parentId =
                    router.query.folderId &&
                    (router.query.folderId[0] as string | null);
                  if (parentId !== "home" && parentId !== undefined) {
                    handleNewFolder(name, parentId);
                  } else {
                    handleNewFolder(name, null);
                  }
                } else if (newType === NewType.note) {
                  const folderId =
                    router.query.folderId &&
                    (router.query.folderId[0] as string | null);
                  if (folderId !== "home" && folderId !== undefined) {
                    handleNewNote(name, folderId);
                  } else {
                    handleNewNote(name, null);
                  }
                }
                toggleVisible({ type: NewType.null });
              }}
            >
              Create
            </button>
          </Modal.Actions>
        </Modal>

        <div className="flex flex-col gap-4 overflow-auto p-4"></div>
      </div>
    </div>
  );
}
