import Head from "next/head";
import FileTable from "../components/dashboard/FileTable";
import Layout from "../layout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Loading from "../components/handlerComponents/Loading";
import Error from "../components/handlerComponents/Error";

export default function FolderId() {
  const router = useRouter();
  const {
    data: folder,
    isLoading,
    isError,
  } = router.query?.folderId
    ? api.folders.getFolder.useQuery({
        id: router.query?.folderId[router.query.folderId.length - 1] as string,
      })
    : {
        data: null,
        isLoading: false,
        isError: false,
      };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Layout>
        {isLoading && <Loading />}
        {isError && <Error />}

        {folder && (
          <>
            <h1 className="m-2 text-4xl font-bold text-secondary">
              {folder.name}
            </h1>
            <FileTable folder={folder} />
          </>
        )}
      </Layout>
    </>
  );
}
