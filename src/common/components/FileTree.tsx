import { type TreeNode } from "../helpers/buildFileTree";
import {
  HiOutlineFolder,
  HiChevronRight,
  HiOutlineDocument,
} from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";

type Props = {
  fileTree: TreeNode[];
};

type TreeProps = {
  node: TreeNode;
  level: number;
};

export default function FileTree({ fileTree }: Props) {
  return (
    <div>
      {fileTree.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}

function TreeNode({ node, level }: TreeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children?.length ? true : false;

  const handleFolderClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="pl-2">
      <div className="flex items-center">
        {hasChildren && (
          <HiChevronRight
            className={`h-8 w-8 transform mr-2 ${
              isOpen ? "rotate-90" : ""
            } transition duration-150 ease-in-out`}
            onClick={handleFolderClick}
          />
        )}
        <Link href={`${node.type === "note" ? "/notes" : "/home"}/${node.id}`} className="flex items-center">
          {node.type === "folder" ? (
            <HiOutlineFolder className="mr-1 h-8 w-8" />
          ) : (
            <HiOutlineDocument className="mr-2 h-8 w-8" />
          )}
          <span>{node.name}</span>
        </Link>
      </div>
      {hasChildren && isOpen && (
        <div className={`pl-2 ${isOpen ? "block" : "hidden"}`}>
          {node?.children?.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
