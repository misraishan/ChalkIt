import { useNodeViewContext } from "@prosemirror-adapter/react";
import type { FC } from "react";
import { Button, Select } from "react-daisyui";
import { HiOutlineClipboard } from "react-icons/hi2";

const langs = [
  "text",
  "css",
  "javascript",
  "typescript",
  "tsx",
  "c",
  "java",
  "kotlin",
  "python",
  "bash",
  "html",
];

export const CodeBlock: FC = () => {
  const { contentRef, selected, node, setAttrs } = useNodeViewContext();
  return (
    <div
      className={`rounded-md bg-base-300 p-4 ${
        selected ? "border-2 border-primary" : ""
      }
        `}
    >
      <div
        contentEditable="false"
        suppressContentEditableWarning
        className="mb-2 flex justify-between"
      >
        <Select
          value={(node.attrs.language as string | undefined) || "text"}
          onChange={(e) => {
            setAttrs({ language: e.target.value });
          }}
        >
          {langs.map((lang) => (
            <Select.Option value={lang} key={lang}>
              {lang}
            </Select.Option>
          ))}
        </Select>

        <Button
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            void navigator.clipboard.writeText(node.textContent);
          }}
        >
          <HiOutlineClipboard size={20} />
        </Button>
      </div>
      <pre spellCheck={false} className="!m-0">
        <code ref={contentRef} />
      </pre>
    </div>
  );
};
