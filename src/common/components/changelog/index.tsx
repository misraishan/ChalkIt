import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import dynamic from "next/dynamic";
const MilkdownEditor = dynamic(() => import("../notes/Milkdown"), {
  ssr: false,
});

export default function Changelog() {
  return (
    <div className="m-4 h-[93vh] overflow-y-scroll rounded-2xl border-2 border-accent outline-none">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkdownEditor
            roomName={"changelog"}
            userName={"Changelog"}
            editable={false}
            // content={}
          />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  );
}
