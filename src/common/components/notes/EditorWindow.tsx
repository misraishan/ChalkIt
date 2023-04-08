import { type ToastType } from "~/common/layout";
import MilkdownEditor from "./Milkdown";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import FloatingMenu from "./milkdownComponents/FloatingMenu";
import MenuBar from "./MenuBar";

export default function EditorWindow({
  noteId,
  userName,
  editable,
  noteName,
}: {
  editable: boolean;
  noteId: string;
  userName: string;
  noteName: string;
  updateToast: (message: string, type: ToastType) => void;
}) {
  return (
    <div className="flex h-screen flex-col">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MenuBar name={noteName} id={noteId} hasWrite={editable} />
          <div
            className="m-4 flex-1 rounded-2xl outline-none"
            onClick={() => {
              const editor = document.querySelector(".milkdown");
              const textbox: HTMLAreaElement | undefined | null =
                editor?.querySelector("[role=textbox]");
              textbox?.focus();
            }}
          >
            <MilkdownEditor
              roomName={noteId}
              userName={userName}
              editable={editable}
            />
            {editable && (
              <div className="sticky top-0 left-0 right-0 bottom-0 m-2 flex justify-center p-8">
                <FloatingMenu />
              </div>
            )}
          </div>
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  );
}
