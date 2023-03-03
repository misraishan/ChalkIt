import { type Shared, type Notes } from "@prisma/client";
import { EditorContent } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, Input, Toast } from "react-daisyui";
import { api } from "~/utils/api";
import Loading from "../components/handlerComponents/Loading";
import TipTap from "../components/notes/TipTap";
import Layout, { ToastType } from "../layout";

export default function NotesEditor() {
  const router = useRouter();
  const user = useSession().data?.user;
  const note = api.notes.getNote.useQuery({
    id: router.query?.noteId ? (router.query?.noteId[0] as string) : "",
  }).data as Notes & { shared: Shared[] };
  const [name, setName] = useState(note?.name);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info || undefined,
  });

  const renameNote = api.notes.updateNote.useMutation();
  const renameFucntion = () => {
    if (name !== note?.name) {
      renameNote.mutate({
        id: note?.id,
        name,
      });
    }
  };

  let hasWrite = false;

  if (note && note.userId !== user?.id) {
    hasWrite = note.shared.find((s) => s.userId === user?.id)?.write
      ? true
      : false;
    if (!hasWrite) {
      void router.push("/");
    }
  } else {
    hasWrite = true;
  }

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

  const editor = TipTap({
    editable: hasWrite,
  });

  return (
    <Layout>
      {editor && note ? (
        <div className="h-screen">
          {note?.name && (
            <Input
              className="mx-4 bg-black text-4xl text-base-content"
              defaultValue={note.name}
              value={name}
              maxLength={50}
              minLength={1}
              onChange={(e) => {
                const newVal = e.target.value;
                if (newVal === note.name) {
                  setName(note.name);
                }
                setName(newVal);
                renameFucntion();
              }}
              disabled={!hasWrite}
              color="accent"
            />
          )}
          <EditorContent
            editor={editor}
            className={
              "m-4 h-[93.5vh] overflow-y-scroll rounded-2xl border-2 border-accent outline-none"
            }
            onClick={() => {
              editor.commands.focus();
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                updateToast("No need to save yourself ;)", ToastType.Success);
              }
            }}
          />
        </div>
      ) : (
        <Loading />
      )}
      {toast.show && (
        <Toast vertical="bottom" horizontal="end">
          <Alert status={toast.type}>{toast.message}</Alert>
        </Toast>
      )}
    </Layout>
  );
}
