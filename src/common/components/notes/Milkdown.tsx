import { Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import {
  indent,
  indentConfig,
  type IndentConfigOptions,
} from "@milkdown/plugin-indent";
import { nord } from "@milkdown/theme-nord";
import { cursor } from "@milkdown/plugin-cursor";
import { clipboard } from "@milkdown/plugin-clipboard";
import { history } from "@milkdown/plugin-history";
// import { usePluginViewFactory } from "@prosemirror-adapter/react";
// import { tooltip, TooltipView } from "./milkdownComponents/Tooltip";
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
  // const pluginViewFactory = usePluginViewFactory();

  const editor = useEditor((root) => {
    return Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable: () => editable,
        }));
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
          type: "tab",
          size: 4,
        } as IndentConfigOptions);

        // ctx.set(tooltip.key, {
        //   view: pluginViewFactory({
        //     component: TooltipView,
        //   }),
        // });
      })
      .use(commonmark)
      .use(gfm)
      .use(collab)
      .use(prism)
      .use(indent)
      .use(cursor)
      .use(history)
      // .use(tooltip)
      .use(clipboard);
  }, []);

  const doc: Doc = new Doc();
  const wsProvider = new WebsocketProvider(
    "wss://ws.chalkit.io",
    roomName,
    doc,
    { connect: true }
  );

  wsProvider.awareness.setLocalStateField("user", {
    name: userName,
    color: randomColor(),
  });

  editor.get()?.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
  });

  return <Milkdown />;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
