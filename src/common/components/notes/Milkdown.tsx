import { Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { indent, indentConfig, type IndentConfigOptions } from "@milkdown/plugin-indent";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import "prism-themes/themes/prism-nord.css";

import markdown from "refractor/lang/markdown";
import css from "refractor/lang/css";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import jsx from "refractor/lang/jsx";
import tsx from "refractor/lang/tsx";
import c from "refractor/lang/c";
import rs from "refractor/lang/rust";
import java from "refractor/lang/java";
import kotlin from "refractor/lang/kotlin";
import python from "refractor/lang/python";

export default function MilkdownEditor({
  roomName,
  userName,
  editable,
}: {
  roomName: string;
  userName: string;
  editable: boolean;
}) {
  const editor = useEditor((root) => {
    return Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable: () => editable,
        }));
        ctx.set(rootCtx, root);
        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown);
            refractor.register(css);
            refractor.register(javascript);
            refractor.register(typescript);
            refractor.register(jsx);
            refractor.register(tsx);
            refractor.register(c);
            refractor.register(rs);
            refractor.register(java);
            refractor.register(kotlin);
            refractor.register(python);
          },
        });
        ctx.set(indentConfig.key, {
          type: 'tab',
          size: 4,
        } as IndentConfigOptions);
      })
      .use(commonmark)
      .use(collab)
      .use(prism)
      .use(indent);
  }, []);

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
