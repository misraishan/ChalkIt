import { useContext, useEffect, useState } from "react";
import UserContext from "~/contexts/UserContext";
import { useRouter } from "next/router";
import { type Notes, type Folders } from "@prisma/client";
import { api } from "~/utils/api";
import { HiOutlineTrash, HiOutlineShare } from "react-icons/hi";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const timeFormat = (time: Date) => {
  return `${time.toLocaleDateString()} ${
    time.toLocaleTimeString().split(":")[0] as string
  }:${time.toLocaleTimeString().split(":")[1] as string} ${
    time.toLocaleTimeString().indexOf("AM") > -1 ? "AM" : "PM"
  }`;
};

enum ColumnType {
  Note = "Note",
  Folder = "Folder",
}

type ColumnRow = {
  id: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
  type: ColumnType;
};

const columnHelper = createColumnHelper<ColumnRow>();

const columns = [
  columnHelper.accessor("id", { header: () => "ID" }),
  columnHelper.accessor("name", { header: () => "Name" }),
  columnHelper.accessor("updatedAt", {
    header: () => "Modified",
    cell: ({ getValue }) => timeFormat(getValue()),
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Created",
    cell: ({ getValue }) => timeFormat(getValue()),
  }),
  columnHelper.accessor("type", { header: () => "Type" }),
];

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

  function createColumnData() {
    const columnData: ColumnRow[] = [];
    if (!notes && !folders) {
      return [
        {
          id: "0",
          name: "No notes or folders",
          updatedAt: new Date(),
          createdAt: new Date(),
          type: ColumnType.Note,
        },
      ];
    }
    if (notes) {
      const notesArr = notes.map((note) => {
        const { id, name, updatedAt, createdAt } = note;
        return {
          id,
          name,
          updatedAt,
          createdAt,
          type: ColumnType.Note,
        };
      });
      columnData.push(...notesArr);
    }
    if (folders) {
      const foldersArr = folders.map((folder) => {
        const { id, name, updatedAt, createdAt } = folder;
        return {
          id,
          name,
          updatedAt,
          createdAt,
          type: ColumnType.Folder,
        };
      });
      columnData.push(...foldersArr);
    }

    return columnData;
  }

  const table = useReactTable<ColumnRow>({
    columns,
    data: createColumnData(),
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    table.setState({
      ...table.getState(),
      columnVisibility: {
        id: false,
      },
      sorting: [
        {
          id: "updatedAt",
          desc: true,
        },
      ],
    });
  }, [table]);

  useEffect(() => {
    void router.prefetch("/notes/new");
  }, [router]);

  const deleteNote = api.notes.deleteNote.useMutation();
  const deleteFolder = api.folders.deleteFolder.useMutation();

  return (
    <div className="flex table h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
      <table className="h-4/5 w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer hover:from-transparent hover:base-100"
              onClick={() => {
                if (row.original.type === ColumnType.Note) {
                  void router.push(`/notes/${row.original.id}`);
                } else {
                  void router.push(`/${row.original.id}`);
                }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
                <div className="flex flex-row">
                  <HiOutlineShare
                    className="cursor-pointer text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <HiOutlineTrash
                    className="cursor-pointer text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.original.type === ColumnType.Note) {
                        deleteNote.mutate({ id: row.id });
                      } else {
                        deleteFolder.mutate({ id: row.id });
                      }
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
