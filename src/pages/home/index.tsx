import FileTable from "../components/dashboard/FileTable";
import Recent from "../components/dashboard/Recent";
import Head from "next/head";
import Layout from "../layout";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        <Recent />
        <h1 className="m-2 text-4xl font-bold">Home</h1>
        <FileTable folder={null}/>
      </Layout>
    </>
  );
}
