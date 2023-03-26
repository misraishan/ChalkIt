import { ButtonGroup, Button } from "react-daisyui";
import { useInstance } from "@milkdown/react";
import type { CmdKey } from "@milkdown/core";
import { callCommand } from "@milkdown/utils";
import { insertTableCommand } from "@milkdown/preset-gfm";
import { undoCommand, redoCommand } from "@milkdown/plugin-history";
import { createCodeBlockCommand } from "@milkdown/preset-commonmark";
import {
  HiCodeBracket,
  HiOutlineTableCells,
  HiOutlineBackward,
  HiOutlineForward,
} from "react-icons/hi2";

export default function FloatingMenu() {
  const [loading, get] = useInstance();
  if (loading) return null;

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  return (
    <div>
      <ButtonGroup>
        <Button onClick={() => call(insertTableCommand.key)}>
          <HiOutlineTableCells />
        </Button>
        <Button onClick={() => call(createCodeBlockCommand.key)}>
          <HiCodeBracket />
        </Button>
        <Button onClick={() => call(undoCommand.key)}>
          <HiOutlineBackward />
        </Button>
        <Button onClick={() => call(redoCommand.key)}>
          <HiOutlineForward />
        </Button>
      </ButtonGroup>
    </div>
  );
}
