import { useState } from "react";
import { Input } from "react-daisyui";
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
    <Input
      className="mx-4 bg-black text-4xl text-base-content"
      value={newName}
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
