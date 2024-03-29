import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "react-daisyui";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>ChalkIt</title>
        <meta
          name="description"
          content="The Markdown editor for the modern web"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="index flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Chalkit
          </h1>
          <p className="text-2xl text-white">
            The Markdown editor for the modern web.
          </p>
          {!session ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Card
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-success/30 p-4 text-white outline-none hover:bg-success/60"
                onClick={() => void signIn()}
              >
                <h3 className="text-2xl font-bold">Sign In →</h3>
                <div>
                  <p className="text-sm">
                    Sign in with your Google, Github, Apple, or Microsoft
                    account today!
                  </p>
                </div>
              </Card>
              <Link
                className="card-bordered flex max-w-xs flex-col gap-4 rounded-xl bg-secondary/30 p-4 text-white hover:bg-secondary/60"
                href="/try"
              >
                <h3 className="text-2xl font-bold">Try it →</h3>
                <div>
                  <p className="text-sm">
                    You can try ChalkIt today without signing up!
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Link
                className="card-bordered flex max-w-xs flex-col gap-4 rounded-xl bg-success/30 p-4 text-white hover:bg-success/60"
                href="/home"
              >
                <h3 className="text-2xl font-bold">Dashboard →</h3>
              </Link>
              <Card
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-error/30 p-4 text-white hover:bg-error/60"
                onClick={() => void signOut()}
              >
                <h3 className="text-2xl font-bold">Sign out →</h3>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
