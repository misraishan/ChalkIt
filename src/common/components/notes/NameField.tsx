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
    if (name !== newName) {
      renameNote.mutate({
        id: id,
        name: newName,
      });
    }
  };

  return (
    <input
      className="mx-4 w-1/2 bg-transparent text-4xl text-base-content outline-none"
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
  );
}
