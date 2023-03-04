import { EditorContent } from "@tiptap/react";
import TipTap from "./TipTap";
import { ToastType } from "~/pages/layout";

export default function EditorWindow({
  editable,
  noteId,
  updateToast,
}: {
  editable: boolean;
  noteId: string;
  updateToast: (message: string, type: ToastType) => void;
}) {
  const editor = TipTap({
    editable,
    noteId,
  });

  return (
    editor && (
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
    )
  );
}
