import Head from "next/head";
import FileTable from "../../common/components/dashboard/FileTable";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Loading from "../../common/components/handlerComponents/Loading";
import Error from "../../common/components/handlerComponents/Error";
import { useContext, useMemo, useState } from "react";
import { type Folders, type Notes } from "@prisma/client";
import UserContext from "~/contexts/UserContext";

export default function FolderId() {
  const router = useRouter();
  const folderId =
    router.query.folderId && (router.query.folderId[0] as string);

  const user = useContext(UserContext);
  const { notes, folders } = user;

  const [folderData, setFolderData] = useState(
    null as Folders[] | null | undefined
  );
  const [notesData, setNotesData] = useState(
    null as Notes[] | null | undefined
  );

  const { data, isLoading, isError } = api.folders.getFolder.useQuery({
    id: folderId as string,
  });

  useMemo(() => {
    if (user) {
      setFolderData(folders?.filter((folder) => folder.parentId === folderId));
      setNotesData(notes?.filter((note) => note.folderId === folderId));
    } else {
      setFolderData(null);
      setNotesData(null);
    }
  }, [folderId, folders, notes, user]);

  return (
    <>
      <Head>
        <title>{data ? data.name : "Loading..."}</title>
      </Head>
      {isLoading && <Loading />}
      {isError && <Error />}

      {data && (
        <>
          <h1 className="m-2 text-4xl font-bold text-secondary">{data.name}</h1>
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
