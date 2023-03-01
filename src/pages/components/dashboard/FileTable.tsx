import { useContext, useState } from "react";
import { Table } from "react-daisyui";
import UserContext from "~/pages/UserContext";

export default function FileTable() {
  // const [filterType, setFilterType] = useState(
  //   "all" as "all" | "folders" | "notes"
  // );
  const ctx = useContext(UserContext);

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
          {ctx.folders && ctx.folders?.map((folder) => (
            <Table.Row key={folder.id} className="bg-transparent">
              <span>{folder.name}</span>
              <span>{folder.updatedAt.toISOString()}</span>
              <span>{folder.createdAt.toISOString()}</span>
              <span>Folder</span>
            </Table.Row>
          ))}
          {ctx.notes && ctx.notes.map((note) => (
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
