import Image from "next/image";
import { type Shared, type Folders, type Notes } from "@prisma/client";
import { type Session } from "next-auth";
import { useState } from "react";
import { Dropdown, Modal } from "react-daisyui";
import {
  HiFolderOpen,
  HiDocumentText,
  HiFolderAdd,
  HiDocumentAdd,
} from "react-icons/hi";

enum NewType {
  folder = "folder",
  note = "note",
  null = "null",
}

export default function SideFileSystem({
  notes,
  folders,
  user,
  session,
  handleNewNote,
  handleNewFolder,
}: {
  notes: Notes[];
  folders: Folders[];
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
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(null as string | null);
  const [visible, setVisible] = useState(false);
  const [newType, setType] = useState("" as NewType);

  const toggleVisible = ({ type }: { type: NewType }) => {
    if (type === NewType.null) {
      setType(type);
      setVisible(!visible);
      return;
    }
    setType(type);
    setVisible(!visible);
  };

  return (
    <div className="w-1/5 bg-neutral">
      <div className="flex h-screen flex-col">
        <div className="flex flex-row items-center justify-between p-4">
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
          <div className="justify-start text-start text-xl">{user?.userId}</div>
        </div>

        <Dropdown
        hover
        horizontal="center"
        className="flex items-center justify-center w-full h-12 text-xl"
        >
          <Dropdown.Toggle
            color="secondary"
          >
            New +
          </Dropdown.Toggle>
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

        <Modal open={visible}>
          <Modal.Header>Create Folder</Modal.Header>
          <Modal.Body>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Folder Name"
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
                  // TODO: Change null, null to parentId, userId
                  handleNewFolder(name, null);
                } else if (newType === NewType.note) {
                  handleNewNote(name, null);
                }
                toggleVisible({ type: NewType.null });
              }}
            >
              Create
            </button>
          </Modal.Actions>
        </Modal>

        <div className="flex flex-col gap-4 p-4">
          {folders.map(
            (folder: Folders) =>
              folder.parentId === null && (
                <div
                  className="flex flex-row items-center gap-4"
                  key={folder.id}
                >
                  <HiFolderOpen size={24} />
                  {folder.name}
                  {/* {folder.parentId === parentId && (
                    <div className="flex flex-col gap-4">
                      {}
                  )} */}
                </div>
              )
          )}
          {notes.map((note: Notes) => {
            if (note.folderId === null) {
              return (
                <div className="flex flex-row items-center gap-4" key={note.id}>
                  <HiDocumentText size={24} />
                  {note.title}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
