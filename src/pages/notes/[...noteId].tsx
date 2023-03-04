import { type Shared, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, Input, Toast } from "react-daisyui";
import { api } from "~/utils/api";
import Loading from "../components/handlerComponents/Loading";
import Layout, { ToastType } from "../layout";
import dynamic from "next/dynamic";

const EditorWindow = dynamic(() => import("../components/notes/EditorWindow"), {
  ssr: false,
});

export default function NotesEditor({ noteId }: { noteId: string }) {
  const user = useSession().data?.user;
  const router = useRouter();
  const note = api.notes.getNote.useQuery({
    id: noteId,
  }).data as Notes & { shared: Shared[] };
  const [name, setName] = useState(note?.name);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info || undefined,
  });

  let hasWrite = false;

  if (note && !note.fullWrite && note.userId !== user?.id) {
    hasWrite = note.shared.find((s) => s.userId === user?.id)?.write
      ? true
      : false;
    if (!hasWrite) {
      void router.push("/");
    }
  } else {
    hasWrite = true;
  }

  const renameNote = api.notes.updateNote.useMutation();
  const renameFucntion = () => {
    if (name !== note?.name) {
      renameNote.mutate({
        id: note?.id,
        name,
      });
    }
  };

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

  
  return (
    <Layout>
      {note ? (
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
          <EditorWindow editable={hasWrite} noteId={noteId} updateToast={updateToast} />
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

export const getServerSideProps = (context: { params: { noteId: string } }) => {
  return {
    props: {
      noteId: context?.params.noteId[0],
    },
  };
};
