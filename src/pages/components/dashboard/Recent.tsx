import { type Folders, type Notes } from "@prisma/client";
import { Card } from "react-daisyui";
import { HiFolderOpen, HiDocumentText } from "react-icons/hi";

export default function Recent({
  folders,
  notes,
}: {
  folders: Folders[];
  notes: Notes[];
}) {
  const mostRecent = [
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

  return (
    <div className="flex flex-row overflow-y-auto overflow-x-auto children:m-4 children:h-36 children:w-36">
      {mostRecent.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-col items-center">
            <Card.Body className="flex items-center justify-center">
            {item.type === "folder" ? (
                <HiFolderOpen size={48} />
              ) : (
                <HiDocumentText size={48} />
              )}
              <span className="text-lg text-center">{item.name}</span>
            </Card.Body>
          </div>
        </Card>
      ))}
    </div>
  );
}
