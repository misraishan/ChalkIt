import { ToastType } from "~/pages/layout";
import MilkdownEditor from "./Milkdown";
import { MilkdownProvider } from "@milkdown/react";

export default function EditorWindow({
  updateToast,
  noteId,
  userName,
}: {
  editable: boolean;
  noteId: string;
  userName: string;
  updateToast: (message: string, type: ToastType) => void;
}) {
  return (
    <div
      className="remirror-theme m-4 h-[93.5vh] overflow-y-scroll rounded-2xl border-2 border-accent outline-none"
      onClick={() => {
        // commands.focus();
      }}
    >
      <MilkdownProvider>
        <MilkdownEditor roomName={noteId} userName={userName} />
      </MilkdownProvider>
    </div>
  );
}
