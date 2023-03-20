import { type Shared, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Alert, Toast } from "react-daisyui";
import { api } from "~/utils/api";
import Loading from "../../common/components/handlerComponents/Loading";
import { ToastType } from "../../common/layout";
import EditorWindow from "../../common/components/notes/EditorWindow";
import NameField from "../../common/components/notes/NameField";
import Head from "next/head";

export default function NotesEditor({
  noteId,
  noteName,
  noteContent,
}: {
  noteId: string;
  noteName: string;
  noteContent: string;
}) {
  const user = useSession().data?.user;
  const router = useRouter();
  const [hasWrite, setHasWrite] = useState(false);
  const note = api.notes.getNote.useQuery({
    id: noteId,
  }).data as Notes & { shared: Shared[] };
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ToastType.Info || undefined,
  });

  useMemo(() => {
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
  }, [note, router, user?.id]);

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
        <meta property="og:url" content="https://beta.chalkit.io" />
        <title>{noteName}</title>
        <meta
          name="description"
          content={
            noteContent ? noteContent.substring(0, 128) : "No content yet :("
          }
        />

        <meta
          property="og:url"
          content={`https://beta.chalkit.io/notes/${noteId}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={noteName} />
        <meta
          property="og:description"
          content={
            noteContent ? noteContent.substring(0, 128) : "No content yet :("
          }
        />
        <meta
          property="og:image"
          content={`/api/og?title=${noteName}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="chalkit.io" />
        <meta
          property="twitter:url"
          content={`https://beta.chalkit.io/notes/${noteId}`}
        />
        <meta name="twitter:title" content={noteName} />
        <meta
          name="twitter:description"
          content={
            noteContent ? noteContent.substring(0, 128) : "No content yet :("
          }
        />
        <meta
          name="twitter:image"
          content={`/api/og?title=${noteName}&description=${
            noteContent ? noteContent.substring(0, 128) : "No content yet :("
          }`}
        />
      </Head>
      {user ? (
        <>
          {note ? (
            <div className="h-screen">
              {note?.name && (
                <NameField name={note.name} id={note.id} hasWrite={hasWrite} />
              )}
              <EditorWindow
                editable={hasWrite}
                noteId={note.id}
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
                <NameField name={note.name} id={note.id} hasWrite={hasWrite} />
              )}
              <EditorWindow
                editable={hasWrite}
                noteId={note.id}
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

import type { AppRouter } from "~/server/api/root";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://test.chalkit.io/api/trpc",
    }),
  ],
  transformer: superjson,
});

export async function getServerSideProps({
  params,
}: {
  params: { noteId: string[] };
}) {
  const noteId = params.noteId[0] as string;
  const note = await client.notes.getNote.query({
    id: noteId,
  });

  return {
    props: {
      noteId: noteId,
      noteName: note?.name || "Untitled",
      noteContent: note?.content || null,
    },
  };
}
