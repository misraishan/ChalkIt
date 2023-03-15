import FileTable from "../../common/components/dashboard/FileTable";
import Head from "next/head";
import { useContext, useMemo, useState } from "react";
import UserContext from "~/contexts/UserContext";
import { type Folders, type Notes } from "@prisma/client";
import Loading from "~/common/components/handlerComponents/Loading";

export default function Dashboard() {
  const user = useContext(UserContext);
  const { folders, notes } = user;

  const [folderData, setFolderData] = useState(
    null as Folders[] | null | undefined
  );
  const [notesData, setNotesData] = useState(
    null as Notes[] | null | undefined
  );

  useMemo(() => {
    if (user) {
      setFolderData(folders?.filter((folder) => folder.parentId === null));
      setNotesData(notes?.filter((note) => note.folderId === null));
    } else {
      setFolderData(null);
      setNotesData(null);
    }
  }, [user, folders, notes]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      {!folders && <Loading />}
      {folders && (
        <>
          <h1 className="m-2 text-4xl font-bold text-secondary">Home</h1>
          <FileTable
            folderData={folderData}
            notesData={notesData}
            setFolderData={setFolderData}
            setNotesData={setNotesData}
          />
        </>
      )}
    </>
  );
}
