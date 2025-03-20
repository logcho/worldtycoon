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
        "bg-muted/60 flex h-[calc(100dvh-5rem)] flex-col gap-2 overflow-y-scroll p-3",
        className,
      )}
      {...props}
    >
      {TOOLS.map((tool) => (
        <div
          key={tool.label}
          onClick={() => onSelectTool(tool)}
          className={cn(
            "bg-muted font-bitmap ring-offset-background flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-3xl ring-yellow-500 ring-offset-2 transition hover:shadow-md",
            selectedTool?.id === tool.id && "ring-2",
          )}
        >
          <span>{tool.emoji}</span>
          <span className="truncate font-medium">{tool.label}</span>
          <span className="bg-foreground/10 font-fixedsys ml-auto rounded-md px-2 py-1 text-sm font-medium shadow-sm">
            ${tool.cost}
          </span>
        </div>
      ))}
    </div>
  );
};
