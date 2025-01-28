import * as React from "react";

import type { Tool } from "~/config/tools";

import { TOOLS } from "~/config/tools";
import { cn } from "~/lib/utils";

export const ToolsSidebar: React.FC<
  React.ComponentProps<"div"> & {
    selectedTool?: Tool;
    onSelectTool: (tool: Tool) => void;
  }
> = ({ selectedTool, onSelectTool, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-3.5rem)] flex-col gap-2 overflow-y-scroll bg-muted/60 p-3",
        className,
      )}
      {...props}
    >
      {TOOLS.map((tool) => (
        <div
          key={tool.label}
          onClick={() => onSelectTool(tool)}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md border bg-muted px-4 py-2 font-bitmap text-3xl ring-red-500 ring-offset-2 transition hover:shadow-md",
            selectedTool?.id === tool.id && "ring-2",
          )}
        >
          <span>{tool.emoji}</span>
          <span className="truncate font-medium">{tool.label}</span>
          <span className="ml-auto rounded-md bg-slate-400 px-2 py-1 font-fixedsys text-sm font-medium">
            ${tool.cost}
          </span>
        </div>
      ))}
    </div>
  );
};
