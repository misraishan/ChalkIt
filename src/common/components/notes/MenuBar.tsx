import { useState } from "react";
import { Avatar, Button, Dropdown, Tooltip } from "react-daisyui";
import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineShare } from "react-icons/hi2";
import { api } from "~/utils/api";
import ShareSheet from "../shareSheet/ShareSheet";
import { getMarkdown, getHTML } from "@milkdown/utils";
import { editorCtx } from "@milkdown/core";
import { useInstance } from "@milkdown/react";

export default function MenuBar({
  name,
  id,
  hasWrite,
}: {
  name: string;
  id: string;
  hasWrite: boolean;
}) {
  const [newName, setNewName] = useState(name);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  const renameNote = api.notes.updateNote.useMutation();
  const renameFucntion = () => {
    if (name !== newName) {
      renameNote.mutate({
        id: id,
        name: newName,
      });
    }
  };

  const [loading, get] = useInstance();

  const download = (type: "markdown" | "html" | "pdf" | "json") => {
    if (loading) return null;
    let content = "" as string | undefined;
    if (type === "markdown") {
      content = get()?.ctx.get(editorCtx).action(getMarkdown());
    } else if (type === "html") {
      content = get()?.ctx.get(editorCtx).action(getHTML());
    }

    const element = document.createElement("a");
    const file = new Blob([content as string], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${newName}.${type === "markdown" ? "md" : type}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    // Remove element from DOM
    document.body.removeChild(element);
  };

  return (
    <div className="flex items-center justify-between">
      <input
        className="mx-4 w-1/2 rounded-md bg-transparent text-4xl text-base-content outline-none hover:outline hover:outline-secondary"
        value={newName}
        placeholder="Untitled"
        maxLength={50}
        minLength={1}
        onChange={(e) => {
          const newVal = e.target.value;
          if (newVal === name) {
            setNewName(name);
          }
          setNewName(newVal);
        }}
        onBlur={() => {
          renameFucntion();
        }}
        disabled={!hasWrite}
      />
      <div className="flex items-center">
        {/* <Avatar.Group> */}
          {/* {collaborators.map((collaborator, idx) => (
            <Tooltip key={idx} message={collaborator.name}>
              <Avatar
                letters={`${collaborator.name[0]?.toUpperCase() as string}`}
                className={`bg-[${collaborator.color}`}
              />
            </Tooltip>
          ))} */}
        {/* </Avatar.Group> */}
        <Button
          className="mr-4"
          onClick={(e) => {
            e.stopPropagation();
            setShareSheetOpen(true);
          }}
        >
          <HiOutlineShare size={24} className="text-primary" />
        </Button>
        <Dropdown className="mr-4" horizontal="left">
          <Dropdown.Toggle>
            <HiOutlineDownload
              size={24}
              className="text-primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => download("markdown")}>
              Markdown
            </Dropdown.Item>
            <Dropdown.Item onClick={() => download("html")}>HTML</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {shareSheetOpen && (
        <ShareSheet
          noteId={id}
          modalOpen={shareSheetOpen}
          setModalOpen={setShareSheetOpen}
        />
      )}
    </div>
  );
}
