import { type Ctx } from "@milkdown/ctx";
import { tooltipFactory, TooltipProvider } from "@milkdown/plugin-tooltip";
import {
  toggleEmphasisCommand,
  toggleLinkCommand,
  toggleStrongCommand,
  toggleInlineCodeCommand,
} from "@milkdown/preset-commonmark";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { useCallback, useEffect, useRef } from "react";
import { callCommand } from "@milkdown/utils";
import { Button, ButtonGroup } from "react-daisyui";
import {
  HiCodeBracket,
  HiOutlineLink,
} from "react-icons/hi2";

export const tooltip = tooltipFactory("Text");

export function TooltipView() {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<TooltipProvider>();

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading || loading === undefined) return;
      get().action(fn);
    },
    [get, loading]
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    tooltipProvider.current = new TooltipProvider({
      content: div,
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  });

  return (
    <div data-desc="This additional wrapper is useful for keeping tooltip component during HMR">
      <div ref={ref}>
        <ButtonGroup className="children:bg-secondary children:text-lg">
          <Button
            className="font-bold"
            onMouseDown={(e) => {
              e.preventDefault();
              action(callCommand(toggleStrongCommand.key));
            }}
          >
            B
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              action(callCommand(toggleEmphasisCommand.key));
            }}
          >
            <em>I</em>
          </Button>
          <Button disabled
            onMouseDown={(e) => {
              e.preventDefault();
              action(callCommand(toggleLinkCommand.key));
            }}
          >
            <HiOutlineLink />
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              action(callCommand(toggleInlineCodeCommand.key));
            }}
          >
            <HiCodeBracket />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
