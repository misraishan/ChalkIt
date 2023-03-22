import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { signIn } from "next-auth/react";
import { Card } from "react-daisyui";
import MilkdownEditor from "~/common/components/notes/Milkdown";

export default function TryNow() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="h-[50vh] w-2/3 overflow-y-scroll rounded-2xl border-2 border-accent outline-none">
          <MilkdownProvider>
            <ProsemirrorAdapterProvider>
              <MilkdownEditor
                roomName={"try"}
                userName={"Anonymous"}
                editable={true}
              />
            </ProsemirrorAdapterProvider>
          </MilkdownProvider>
        </div>
      </div>
      <div className="

      flex items-center justify-center absolute bottom-0 left-0 right-0
      ">
      <Card
        className="flex max-w-xs flex-col gap-4 rounded-xl bg-success/30 p-4 text-white outline-none hover:bg-success/60"
        onClick={() => void signIn()}
      >
        <h3 className="text-2xl font-bold">Sign In →</h3>
        <div>
          <p className="text-sm">
            Sign in with your Google, Github, Apple, or Microsoft account today!
          </p>
        </div>
      </Card>
      </div>
    </>
  );
}
