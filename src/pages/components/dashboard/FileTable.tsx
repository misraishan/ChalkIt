import { useContext } from "react";
import { Table } from "react-daisyui";
import UserContext from "~/pages/UserContext";
import { useRouter } from "next/router";
import { type Notes, type Folders } from "@prisma/client";
import { api } from "~/utils/api";

export default function FileTable({
  folder,
}: {
  folder:
    | (Folders & {
        notes: Notes[];
        _count: {
          notes: number;
        };
      })
    | null;
}) {
  const ctx = useContext(UserContext);
  const router = useRouter();

  const { notes } = folder ? folder : ctx;
  const folders = folder
    ? api.folders.getFolderByParent.useQuery({ id: folder.id }).data
    : ctx.folders;

  const timeFormat = (time: Date) => {
    return `${time.toLocaleDateString()} ${
      time.toLocaleTimeString().split(":")[0] as string
    }:${time.toLocaleTimeString().split(":")[1] as string} ${
      time.toLocaleTimeString().indexOf("AM") > -1 ? "AM" : "PM"
    }`;
  };

  return (
    <div className="flex flex-col overflow-x-auto overflow-y-auto children:bg-transparent">
      <Table dataTheme="" className="children:bg-transparent">
        <Table.Head>
          <span>Name</span>
          <span>Modified</span>
          <span>Created</span>
          <span>Type</span>
        </Table.Head>
        <Table.Body>
          {folders &&
            folders?.map((folder) => (
              <Table.Row
                key={folder.id}
                onMouseEnter={() => {
                  void router.prefetch(`${router.asPath}/${folder.id}`);
                }}
                onClick={() => {
                  void router.push({
                    pathname: `${router.asPath}/${folder.id}`,
                  });
                }}
              >
                <span>{folder.name}</span>
                <span>{timeFormat(folder.updatedAt)}</span>
                <span>{timeFormat(folder.createdAt)}</span>
                <span>Folder</span>
              </Table.Row>
            ))}
          {notes &&
            notes.map((note) => (
              <Table.Row
                onMouseEnter={() => {
                  void router.prefetch(`/notes/${note.id}`);
                }}
                key={note.id}
                onMouseOver={() => {
                  void router.prefetch(`/notes/${note.id}`);
                }}
                onClick={() => {
                  void router.push(`/notes/${note.id}`);
                }}
              >
                <span>{note.name}</span>
                <span>{timeFormat(note.updatedAt)}</span>
                <span>{timeFormat(note.createdAt)}</span>
                <span>Note</span>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
}
