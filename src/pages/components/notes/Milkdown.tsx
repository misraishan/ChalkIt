import { Editor, rootCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function MilkdownEditor({
  roomName,
  userName,
}: {
  roomName: string;
  userName: string;
}) {
  const editor = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark)
      .use(collab)
  );

  const doc: Doc = new Doc();
  const wsProvider = new WebsocketProvider(
    "wss://ws.chalkit.io",
    roomName,
    doc
  );

  wsProvider.awareness.setLocalStateField("user", {
    name: userName,
    color: "#fff000",
  });

  editor.get()?.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);

    collabService.bindDoc(wsProvider.doc).connect();
  });

  return <Milkdown />;
}
