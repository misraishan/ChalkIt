import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TipTap({ editable }: { editable: boolean }) {
  return useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm m-auto",
      },
    },
    autofocus: true,
    editable,
  });
}
