import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { useMemo, useState } from "react";

export default function TipTap({
  editable,
  noteId,
}: {
  editable: boolean;
  noteId: string;
}) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  useMemo(() => {
    const yDoc = new Y.Doc();
    setProvider(
      new HocuspocusProvider({
        document: yDoc,
        name: noteId,
        url: "wss://ws.chalkit.io",
      })
    );
  }, [noteId]);
  return useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: provider?.document,
      }),
    ], 
    editorProps: {
      attributes: {
        class: "prose prose-sm m-auto",
      },
    },
    autofocus: true,
    editable,
  });
}
