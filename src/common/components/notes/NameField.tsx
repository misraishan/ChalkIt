import { useState } from "react";
import { api } from "~/utils/api";

export default function NameField({
  name,
  id,
  hasWrite,
}: {
  name: string;
  id: string;
  hasWrite: boolean;
}) {
  const [newName, setNewName] = useState(name);

  const renameNote = api.notes.updateNote.useMutation();
  const renameFucntion = () => {
    if (name !== name) {
      renameNote.mutate({
        id: id,
        name: newName,
      });
    }
  };

  return (
    <input
      className="mx-4 text-4xl text-base-content bg-transparent outline-none w-1/2"
      value={newName}
      placeholder="Untitled"
      maxLength={50}
      minLength={1}
      onChange={(e) => {
        console.log("e.target.value", e.target.value);
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
      color="accent"
    />
  );
}
