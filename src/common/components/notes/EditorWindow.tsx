import { type ToastType } from "~/common/layout";
import MilkdownEditor from "./Milkdown";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

export default function EditorWindow({
  noteId,
  userName,
  editable,
}: {
  editable: boolean;
  noteId: string;
  userName: string;
  updateToast: (message: string, type: ToastType) => void;
}) {
  return (
    <div className="m-4 h-[93vh] overflow-y-scroll rounded-2xl border-2 border-accent outline-none">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkdownEditor
            roomName={noteId}
            userName={userName}
            editable={editable}
          />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  );
}
