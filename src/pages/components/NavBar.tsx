import { signOut, useSession, signIn } from "next-auth/react";
import { Navbar, Button, Input } from "react-daisyui";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-auto justify-center">
      <Navbar className="my-4 w-11/12 rounded-2xl bg-black">
        <Navbar.Start>
          <Button color="primary">Chalkit</Button>
        </Navbar.Start>
        <Navbar.End>
          {session ? (
            <div>
              <Input placeholder="Search 🔎" className="mx-4" />
              <Button
                color="error"
                className="mx-1"
                onClick={() => void signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div>
              <Button color="primary" onClick={() => void signIn()}>
                Sign In
              </Button>
            </div>
          )}
        </Navbar.End>
      </Navbar>
    </div>
  );
}
