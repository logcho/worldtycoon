"use client";

import type { Tool } from "@/config/tools";
import { TOOLS } from "@/config/tools";
import ToolCard from "./tool-card";

type ToolBoxProps = {
  selectedTool: Tool | undefined;
  setSelectedTool: (tool: Tool | undefined) => void;
};

export default function ToolBox({ selectedTool, setSelectedTool }: ToolBoxProps) {
  const handleSelect = (tool: Tool) => {
    if (selectedTool?.id === tool.id) {
      setSelectedTool(undefined); // Deselect if already selected
    } else {
      setSelectedTool(tool);
    }
  };

  return (
    <div className="hidden md:flex flex-col items-center justify-center md:w-1/6 md:h-full bg-muted">
      <div
        className={`
          bg-neutral-900 flex h-full w-full flex-col gap-2 overflow-y-scroll p-3
        `}
        style={{ scrollbarWidth: "none" }}
      >
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            selected={selectedTool?.id === tool.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
