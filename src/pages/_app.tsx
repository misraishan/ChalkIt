import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import NavBar from "./components/NavBar";
import { useRouter } from "next/router";
import FooterBar from "./components/FooterBar";
import "~/styles/editor.scss"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <div className="bg-neutral">
        {router.pathname !== "/" && <NavBar />}
        <Component {...pageProps} />
        <div className="mx-4 h-1/6">
        <FooterBar />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
