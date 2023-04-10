import { Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { Milkdown, useEditor } from "@milkdown/react";
import { codeBlockSchema, commonmark } from "@milkdown/preset-commonmark";
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
import { upload, uploadConfig } from '@milkdown/plugin-upload';
import { nord } from "@milkdown/theme-nord";
import { cursor } from "@milkdown/plugin-cursor";
import { clipboard } from "@milkdown/plugin-clipboard";
import { history } from "@milkdown/plugin-history";
import {
  useNodeViewFactory,
  usePluginViewFactory,
} from "@prosemirror-adapter/react";
import { tooltip, TooltipView } from "./milkdownComponents/Tooltip";
import { defaultValueCtx } from "@milkdown/core";
import { $view } from "@milkdown/utils";
import { refractor } from "refractor";
import { trailing } from "@milkdown/plugin-trailing";
import "@milkdown/theme-nord/style.css";
import "prism-themes/themes/prism-nord.css";

import { CodeBlock } from "./milkdownComponents/CodeBlock";
import { uploader } from "~/common/helpers/uploader";

const tryNowValue = `# Welcome to ChalkIt!
## The markdown editor for the modern web.
`;

export default function MilkdownEditor({
  roomName,
  userName,
  editable,
}: {
  roomName: string;
  userName: string;
  editable: boolean;
}) {
  const pluginViewFactory = usePluginViewFactory();
  const nodeViewFactory = useNodeViewFactory();

  const editor = useEditor((root) => {
    return Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable: () => editable,
        }));

        roomName === "try" && ctx.set(defaultValueCtx, tryNowValue);

        ctx.update(prismConfig.key, (prev) => ({
          ...prev,
          configureRefractor: () => refractor,
        }));

        ctx.set(indentConfig.key, {
          type: "tab",
          size: 4,
        } as IndentConfigOptions);

        ctx.set(tooltip.key, {
          view: pluginViewFactory({
            component: TooltipView,
          }),
        });

        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader,
        }));
    
      })
      .use(commonmark)
      .use(gfm)
      .use(collab)
      .use(prism)
      .use(indent)
      .use(cursor)
      .use(history)
      .use(tooltip)
      .use(clipboard)
      .use(trailing)
      .use(upload)
      .use(
        $view(codeBlockSchema.node, () =>
          nodeViewFactory({ component: CodeBlock })
        )
      );
  }, []);

  if (roomName !== "try") {
    const doc: Doc = new Doc();
    const wsProvider = new WebsocketProvider(
      "wss://ws.chalkit.io",
      roomName,
      doc,
      { connect: true }
    );

    const user = {
      name: userName,
      color: randomColor(),
    };
    wsProvider.awareness.setLocalStateField("user", {
      ...user,
    });

    editor.get()?.action((ctx) => {
      const collabService = ctx.get(collabServiceCtx);
      collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
    });
  }

  return <Milkdown />;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
