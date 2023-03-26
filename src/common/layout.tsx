import { type Folders, type Notes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import UserContext from "../contexts/UserContext";

export enum ToastType {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export default function Layout({
  children,
  userInfo,
}: {
  children: React.ReactNode;
  userInfo: {
    folders: Folders[] | null | undefined;
    setFolders: (folders: Folders[] | null | undefined) => void;
    notes: Notes[] | null | undefined;
    setNotes: (notes: Notes[] | null | undefined) => void;
    userId: string | null | undefined;
    setUserId: (userId: string | null | undefined) => void;
  };
}) {
  const { data: session } = useSession();

  const { data } = api.users.getUser.useQuery({
    id: session?.user.id as string,
  });

  const { folders, setFolders, notes, setNotes, userId, setUserId } = userInfo;
  const [user, setUser] = useState(data);

  useEffect(() => {
    if (data) {
      setUser(data);
      setFolders(data.folders);
      setNotes(data.notes);
    }
  }, [data, setFolders, setNotes]);

  useMemo(() => {
    if (user) {
      setUserId(user.userId);
    }
  }, [setUserId, user]);

  const values = useMemo(
    () => ({
      folders,
      setFolders,
      notes,
      setNotes,
      userId,
      setUserId,
    }),
    [folders, notes, setFolders, setNotes, setUserId, userId]
  );
  return (
    <UserContext.Provider value={values}>
      <div className="w-full overflow-y-auto overflow-x-hidden">{children}</div>
    </UserContext.Provider>
  );
}
