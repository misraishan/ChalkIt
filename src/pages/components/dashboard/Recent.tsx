import { useContext } from "react";
import { Card } from "react-daisyui";
import { HiFolderOpen, HiDocumentText } from "react-icons/hi";
import UserContext from "~/pages/UserContext";

export default function Recent() {
  const { folders, notes } = useContext(UserContext);
  let mostRecent = [];
  if (folders && notes) {
    mostRecent = [
      ...folders.map((folder) => {
        return {
          ...folder,
          type: "folder",
        };
      }),
      ...notes.map((note) => {
        return {
          ...note,
          type: "note",
        };
      }),
    ]
      .sort((a, b) => {
        b.updatedAt.getTime() - a.updatedAt.getTime();
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      })
      .splice(0, 10);
  } else {
    return (
      <div className="flex flex-row overflow-x-auto overflow-y-auto children:m-4 children:h-36 children:w-36">
        <Card>
          <div className="flex flex-col items-center">
            <Card.Body className="flex items-center justify-center">
              <span className="text-center text-lg">No recent files</span>
            </Card.Body>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-row overflow-x-auto overflow-y-auto children:m-4 children:h-36 children:w-36">
      {mostRecent.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-col items-center">
            <Card.Body className="flex items-center justify-center">
              {item.type === "folder" ? (
                <HiFolderOpen size={48} />
              ) : (
                <HiDocumentText size={48} />
              )}
              <span className="text-center text-lg">{item.name}</span>
            </Card.Body>
          </div>
        </Card>
      ))}
    </div>
  );
}
