import { type ToastType } from "~/common/layout";
import MilkdownEditor from "./Milkdown";
import { MilkdownProvider } from "@milkdown/react";
import { useState, useEffect } from "react";

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="m-4 h-[93vh] overflow-y-scroll rounded-2xl border-2 border-accent outline-none">
      <MilkdownProvider>
        {isClient && <MilkdownEditor roomName={noteId} userName={userName} editable={editable} />}
      </MilkdownProvider>
    </div>
  );
}
