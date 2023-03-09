import { type Shared, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, Toast } from "react-daisyui";
import { api } from "~/utils/api";
import Loading from "../../common/components/handlerComponents/Loading";
import Layout, { ToastType } from "../../common/layout";
import EditorWindow from "../../common/components/notes/EditorWindow";
import NameField from "../../common/components/notes/NameField";
import Head from "next/head";

export default function NotesEditor({ noteId }: { noteId: string }) {
  const user = useSession().data?.user;
  const router = useRouter();
  const note = api.notes.getNote.useQuery({
    id: noteId,
  }).data as Notes & { shared: Shared[] };
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
        <title>{note?.name || "Untitled"} - Notes</title>
        <meta
          name="description"
          content={`${note?.name} created on Chalkit.io`}
        />
      </Head>
      <Layout>
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
      </Layout>
    </>
  );
}

export const getServerSideProps = (context: { params: { noteId: string } }) => {
  return {
    props: {
      noteId: context?.params.noteId[0],
    },
  };
};
