import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { type Notes, type Folders } from "@prisma/client";
import { api } from "~/utils/api";
import {
  HiOutlineTrash,
  HiOutlineShare,
  HiOutlineArrowSmDown,
  HiOutlineArrowSmUp,
} from "react-icons/hi";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Modal } from "react-daisyui";
import ShareSheet from "../shareSheet/ShareSheet";
import Link from "next/link";
import UserContext from "~/contexts/UserContext";

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

  useEffect(() => {
    setNotesData(notesData);
    setFolderData(folderData);
  }, [setNotesData, notesData, setFolderData, folderData]);

  const { setFolders, folders, setNotes, notes } = useContext(UserContext);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareSheetData, setShareSheetData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    id: string;
    type: "folder" | "note";
    name: string;
  } | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedData = useMemo(() => {
    const columnData = createColumnData({
      folders: folderData,
      notes: notesData,
    });
    for (const column of columnData) {
      if (column.type === ColumnType.Folder)
        void router.prefetch(`/home/${column.id}`);
    }

    return columnData;
  }, [folderData, notesData, router]);

  const table = useReactTable<ColumnRow>({
    columns,
    data: memoizedData,
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  useMemo(() => {
    table.setState({
      ...table.getState(),
      columnVisibility: {
        id: false,
      },
      sorting: sorting,
    });
  }, [sorting, table]);

  useEffect(() => {
    void router.prefetch("/notes/new");
  }, [router]);

  const deleteNote = api.notes.deleteNote.useMutation();
  const deleteFolder = api.folders.deleteFolder.useMutation();

  return (
    <div className="flex table w-full flex-col overflow-x-hidden overflow-y-scroll">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={
                    header.column.getIsSorted()
                      ? "outline- bg-base-100 outline outline-purple-400"
                      : ""
                  }
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex flex-row items-center ${
                        header.column.getIsSorted() ? "font-extrabold" : ""
                      } ${
                        header.column.getCanSort()
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: (
                          <HiOutlineArrowSmUp
                            size={20}
                            className={"flex flex-row"}
                          />
                        ),
                        desc: <HiOutlineArrowSmDown size={20} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
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
              className="hover:base-100 h-24 cursor-pointer hover:from-transparent"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  <Link
                    href={
                      row.original.type === ColumnType.Note
                        ? `/notes/${row.original.id}`
                        : `/home/${row.original.id}`
                    }
                    className="flex h-24 cursor-pointer
                    flex-row items-center hover:from-transparent"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Link>
                </td>
              ))}
              <td>
                <div className="flex flex-row">
                  {row.original.type === ColumnType.Note ? (
                    <HiOutlineShare
                      size={28}
                      className="cursor-pointer text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (row.original.type === ColumnType.Note) {
                          setShareSheetData(row.original.id);
                          setShareSheetOpen(true);
                        }
                      }}
                    />
                  ) : (
                    <span className="w-[28px]"></span>
                  )}
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
      {shareSheetOpen && shareSheetData && (
        <ShareSheet
          noteId={shareSheetData}
          modalOpen={shareSheetOpen}
          setModalOpen={setShareSheetOpen}
        />
      )}
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
                  setFolders(
                    folders?.filter((folder) => folder.id !== modalData?.id)
                  );
                } else {
                  deleteNote.mutate({ id: modalData?.id });
                  setNotesData(
                    notesData?.filter((note) => note.id !== modalData?.id)
                  );
                  setNotes(notes?.filter((note) => note.id !== modalData?.id));
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
