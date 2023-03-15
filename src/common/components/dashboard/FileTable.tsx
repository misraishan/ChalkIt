import { useEffect, useMemo, useState } from "react";
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
import { Modal } from "react-daisyui";

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
  notesData,
  folderData,
  setNotesData,
  setFolderData,
}: {
  notesData: Notes[] | null | undefined;
  folderData: Folders[] | null | undefined;
  setNotesData: (notes: Notes[] | null | undefined) => void;
  setFolderData: (folder: Folders[] | null | undefined) => void;
}) {
  const router = useRouter();

  console.log(notesData, folderData);
  useEffect(() => {
    setNotesData(notesData);
    setFolderData(folderData);
  }, [setNotesData, notesData, setFolderData, folderData]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    id: string;
    type: "folder" | "note";
    name: string;
  } | null>(null);

  const memoizedData = useMemo(
    () => createColumnData({ folders: folderData, notes: notesData }),
    [folderData, notesData]
  );

  const table = useReactTable<ColumnRow>({
    columns,
    data: memoizedData,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  useMemo(() => {
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
      <table className="h-[50rem] w-full">
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
              className="hover:base-100 cursor-pointer hover:from-transparent"
              onClick={() => {
                if (row.original.type === ColumnType.Note) {
                  void router.push(`/notes/${row.original.id}`);
                } else {
                  void router.push(`/home/${row.original.id}`);
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
                    size={28}
                    className="cursor-pointer text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <HiOutlineTrash
                    size={28}
                    className="cursor-pointer text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalData({
                        id: row.original.id,
                        type:
                          row.original.type === ColumnType.Note
                            ? "note"
                            : "folder",
                        name: row.original.name,
                      });
                      setModalOpen(true);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && modalData && (
        <Modal
          open={modalOpen}
          onClickBackdrop={() => {
            setModalOpen(false);
            setModalData(null);
          }}
        >
          <Modal.Header className="font-bold">
            Are you sure you want to delete {modalData?.name}?
          </Modal.Header>
          <Modal.Actions>
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              className="btn-error btn-sm btn"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (modalData?.type === "folder") {
                  deleteFolder.mutate({ id: modalData?.id });
                  setFolderData(
                    folderData?.filter((folder) => folder.id !== modalData?.id)
                  );
                } else {
                  deleteNote.mutate({ id: modalData?.id });
                  setNotesData(
                    notesData?.filter((note) => note.id !== modalData?.id)
                  );
                }
                setModalOpen(false);
              }}
              className="btn-error btn-sm btn"
            >
              Delete
            </button>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  );
}

function createColumnData({
  notes,
  folders,
}: {
  notes: Notes[] | null | undefined;
  folders: Folders[] | null | undefined;
}) {
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
