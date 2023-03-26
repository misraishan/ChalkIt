import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import NavBar from "../common/components/NavBar";
import { useRouter } from "next/router";
import FooterBar from "../common/components/FooterBar";
import Layout from "~/common/layout";
import SideFileSystem from "~/common/components/SideFileSystem";
import type { Folders, Notes } from "@prisma/client";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const [folders, setFolders] = useState(null as Folders[] | null | undefined);
  const [notes, setNotes] = useState(null as Notes[] | null | undefined);

  const [userId, setUserId] = useState(null as string | null | undefined);

  return (
    <>
      <SessionProvider session={session}>
        <div>
          {router.pathname !== "/" && <NavBar />}
          {router.pathname !== "/" ? (
            <div className="flex h-screen flex-row">
              <SideFileSystem
                userInfo={{
                  folders,
                  setFolders,
                  notes,
                  setNotes,
                  userId,
                  setUserId,
                }}
              />
              <div className="w-0.5 bg-accent"></div>
              <Layout
                userInfo={{
                  folders,
                  setFolders,
                  notes,
                  setNotes,
                  userId,
                  setUserId,
                }}
              >
                <Component {...pageProps} />
              </Layout>
            </div>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </SessionProvider>
      <FooterBar />
    </>
  );
};

export default api.withTRPC(MyApp);
