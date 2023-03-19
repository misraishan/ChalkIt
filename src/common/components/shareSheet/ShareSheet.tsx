import { type Notes, type Shared } from "@prisma/client";
import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputGroup,
  Modal,
  Toggle,
  Tooltip,
} from "react-daisyui";
import { api } from "~/utils/api";
import {
  HiOutlineClipboard,
  HiOutlinePencil,
  HiOutlinePencilSquare,
  HiOutlineXCircle,
} from "react-icons/hi2";

const defaults = {
  id: "",
  name: "",
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "",
  fullRead: false,
  fullWrite: false,
  shared: [],
  folderId: "",
};

export default function ShareSheet({
  noteId,
  modalOpen,
  setModalOpen,
}: {
  noteId: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}) {
  const { data: note } = api.notes.getNote.useQuery({ id: noteId });
  const [shareUser, setShareUser] = useState<{ id: string; write: boolean }>({
    id: "",
    write: false,
  });
  const [noteData, setNoteData] = useState<Notes & { shared: Shared[] }>(
    defaults
  );
  const [modalData, setModalData] = useState<{
    id: string;
    name: string;
    shared: {
      uid: string;
      write: boolean;
      userId: string | null | undefined;
    }[];
  } | null>(null);

  useMemo(() => {
    if (note) {
      setNoteData(note);
      setModalData({
        id: noteData.id,
        name: noteData.name,
        shared: noteData.shared.map((share) => ({
          uid: share.userId,
          write: share.write,
          userId: null as string | null | undefined,
        })),
      });
    }
  }, [note, noteData.id, noteData.name, noteData.shared]);

  const shareNote = api.notes.shareNote.useMutation();
  const unshareNote = api.notes.unshareNote.useMutation();
  const getUser = api.users.getAllUsers.useQuery({
    id: note?.shared.map((share) => share.userId),
    noteId: note?.id,
  });
  const updateNote = api.notes.updateNote.useMutation();

  useMemo(() => {
    if (getUser.data) {
      setModalData({
        id: noteData?.id,
        name: noteData?.name,
        shared: noteData.shared.map((share) => ({
          uid: share.userId,
          write: share.write,
          userId: getUser.data.find((user) => user.id === share.userId)?.userId,
        })),
      });
    }
  }, [getUser.data, noteData?.id, noteData?.name, noteData.shared]);

  return (
    <Modal
      open={modalOpen}
      onClickBackdrop={() => {
        setModalOpen(false);
      }}
    >
      <Modal.Header className="text-2xl font-bold">
        Share {modalData?.name}
      </Modal.Header>
      <Modal.Body>
        <Form
          className="flex flex-1 flex-col place-items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (shareUser.id === "" || !shareUser.id.includes("#")) return;

            if (
              modalData?.shared
                .map((share) => share.userId)
                .includes(shareUser.id)
            )
              return;

            if (modalData) {
              setModalData({
                ...modalData,
                shared: [
                  ...modalData.shared,
                  {
                    uid: shareUser.id,
                    write: shareUser.write,
                    userId: shareUser.id,
                  },
                ],
              });

              shareNote.mutate({
                id: noteData.id,
                userId: shareUser.id,
              });
            }
            setShareUser({ id: "", write: false });
          }}
        >
          <InputGroup>
            <Input
              placeholder="User ID"
              value={shareUser.id}
              onChange={(e) => {
                setShareUser({ id: e.target.value, write: shareUser.write });
              }}
              className="w-full"
            />

            <Button
              color={shareUser.write ? "success" : "error"}
              type="button"
              onClick={() => {
                setShareUser({ id: shareUser.id, write: !shareUser.write });
              }}
            >
              <HiOutlinePencil />
            </Button>
          </InputGroup>
          <Button color="success" size="sm" className=" w-1/3">
            Share
          </Button>
        </Form>
        <div className="flex flex-col gap-2">
          {modalData?.shared.map((user) => (
            <>
              <div className="flex flex-row justify-between">
                <div className="font-bold">{user.userId || "Test"}</div>
                <div className="flex flex-1 justify-end children:mx-1">
                  <Tooltip
                    message={user.write ? "Remove write" : "Write access"}
                    color={user.write ? "error" : "success"}
                  >
                    <Button
                      color={user.write ? "error" : "success"}
                      size="sm"
                      onClick={() => {
                        shareNote.mutate({
                          id: noteData.id,
                          userId: user.uid,
                          write: !user.write,
                        });
                        setModalData({
                          ...modalData,
                          shared: modalData.shared.map((share) =>
                            share.uid === user.uid
                              ? { ...share, write: !share.write }
                              : share
                          ),
                        });
                      }}
                    >
                      <HiOutlinePencilSquare size={20} />
                    </Button>
                  </Tooltip>
                  <Tooltip message="Unshare" color="error">
                    <Button
                      color="error"
                      size="sm"
                      onClick={() => {
                        unshareNote.mutate({
                          id: noteData.id,
                          userId: user.uid,
                        });
                        setModalData({
                          ...modalData,
                          shared: modalData.shared.filter(
                            (share) => share.uid !== user.uid
                          ),
                        });
                      }}
                    >
                      <HiOutlineXCircle size={20} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </>
          ))}
          <h3 className="text-bold text-xl text-accent">
            All perms Full Read:
          </h3>
          <Form className="flex flex-row justify-between">
            <Form.Label>Full read access</Form.Label>
            <Toggle
              color={noteData.fullRead ? "success" : "error"}
              checked={noteData.fullRead}
              className="m-2"
              onChange={(e) => {
                setNoteData({
                  ...noteData,
                  fullRead: e.target.checked,
                  fullWrite:
                    e.target.checked === false ? false : noteData.fullWrite,
                });
                updateNote.mutate({
                  id: noteData.id,
                  fullRead: e.target.checked,
                  fullWrite:
                    e.target.checked === false ? false : noteData.fullWrite,
                });
              }}
            />
          </Form>
          <Form className="flex flex-row justify-between gap-2">
            <Form.Label>Full write access</Form.Label>
            <Toggle
              color={noteData.fullWrite ? "success" : "error"}
              checked={noteData.fullWrite}
              className="m-2"
              onChange={(e) => {
                setNoteData({
                  ...noteData,
                  fullWrite: e.target.checked,
                  fullRead: e.target.checked ? true : noteData.fullRead,
                });
                updateNote.mutate({
                  id: noteData.id,
                  fullWrite: e.target.checked,
                  fullRead: true,
                });
              }}
            />
          </Form>
        </div>
        <div>
          <h3 className="text-bold text-xl text-accent">Share link:</h3>
          <InputGroup className="flex flex-1">
            <Input
              disabled
              value={`chalkit.io/notes/${noteData.id}`}
              className="w-full"
            />
            <span
              className="btn bg-secondary hover:cursor-pointer hover:bg-primary"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://chalkit.io/notes/${noteData.id}`
                );
              }}
            >
              <HiOutlineClipboard />
            </span>
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Actions></Modal.Actions>
    </Modal>
  );
}
