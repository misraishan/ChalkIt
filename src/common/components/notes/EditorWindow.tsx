import { type ToastType } from "~/common/layout";
import MilkdownEditor from "./Milkdown";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import FloatingMenu from "./milkdownComponents/FloatingMenu";

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
        <div className="sticky top-0 left-0 right-0 bottom-0 m-2 flex justify-center p-8">
          {editable && <FloatingMenu />}
        </div>
      </MilkdownProvider>
    </div>
  );
}
