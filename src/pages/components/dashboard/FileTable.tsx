import { type Folders, type Notes } from "@prisma/client";
import { useState } from "react";
import { Table } from "react-daisyui";

export default function FileTable({
  folders,
  notes,
}: {
  folders: Folders[];
  notes: Notes[];
}) {
  const [filterType, setFilterType] = useState(
    "all" as "all" | "folders" | "notes"
  );
  return (
    <div className="flex w-full flex-col children:bg-transparent">
      <Table dataTheme="" className="children:bg-transparent">
        <Table.Head>
          <span>Name</span>
          <span>Modified</span>
          <span>Created</span>
          <span>Type</span>
        </Table.Head>
        <Table.Body>
          {folders.map((folder) => (
            <Table.Row key={folder.id} className="bg-transparent">
              <span>{folder.name}</span>
              <span>{folder.updatedAt.toISOString()}</span>
              <span>{folder.createdAt.toISOString()}</span>
              <span>Folder</span>
            </Table.Row>
          ))}
          {notes.map((note) => (
            <Table.Row key={note.id}>
              <span>{note.name}</span>
              <span>{note.updatedAt.toISOString()}</span>
              <span>{note.createdAt.toISOString()}</span>
              <span>Note</span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
