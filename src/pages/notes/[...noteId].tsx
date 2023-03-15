import { type Shared, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Toast } from "react-daisyui";
import { api } from "~/utils/api";
import Loading from "../../common/components/handlerComponents/Loading";
import { ToastType } from "../../common/layout";
import EditorWindow from "../../common/components/notes/EditorWindow";
import NameField from "../../common/components/notes/NameField";
import Head from "next/head";

export default function NotesEditor() {
  const user = useSession().data?.user;
  const router = useRouter();
  const [hasWrite, setHasWrite] = useState(false);
  const noteId = router.query?.noteId?.[0] as string;
  const note = api.notes.getNote.useQuery({
    id: noteId,
  }).data as Notes & { shared: Shared[] };
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info || undefined,
  });

  useEffect(() => {
    if (note) {
      if (note?.fullWrite || note?.userId === user?.id) setHasWrite(true);
      else if (note.shared.length > 0) {
        note.shared.find((s) => s.userId === user?.id)?.write
          ? setHasWrite(true)
          : setHasWrite(false);
      } else if (note?.fullRead) setHasWrite(false);
      else {
        void router.push("/");
      }
    }
  }, [hasWrite, note, router, user?.id]);

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
    <>
      <Head>
        <title>New Note</title>
        <meta name="description" content={`Created on Chalkit.io`} />
      </Head>
      {user ? (
        <>
          {note ? (
            <div className="h-screen">
              {note?.name && (
                <NameField name={note.name} id={noteId} hasWrite={hasWrite} />
              )}
              <EditorWindow
                editable={hasWrite}
                noteId={noteId}
                updateToast={updateToast}
                userName={user?.name || "Anonymous"}
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
        </>
      ) : (
        <>
          {note ? (
            <div className="h-screen">
              {note?.name && (
                <NameField name={note.name} id={noteId} hasWrite={hasWrite} />
              )}
              <EditorWindow
                editable={hasWrite}
                noteId={noteId}
                updateToast={updateToast}
                userName={"Anonymous"}
              />
            </div>
          ) : (
            <Loading />
          )}
        </>
      )}
    </>
  );
}
