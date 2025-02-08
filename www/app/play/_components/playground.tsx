"use client";

import * as React from "react";

import type { Tool } from "~/config/tools";

import { useEventListener } from "~/hooks/use-event-listner";

import { StageArea } from "./stage-area";
import { ToolsSidebar } from "./tools-sidebar";

export const Playground: React.FC = () => {
  const [selectedTool, setSelectedTool] = React.useState<Tool>();

  useEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSelectedTool(undefined);
    }
  });

  return (
    <div className="w-dvh flex">
      <ToolsSidebar
        selectedTool={selectedTool}
        onSelectTool={(tool) => setSelectedTool(tool)}
        className="w-1/5"
      />
      <StageArea selectedTool={selectedTool} className="!w-4/5" />
    </div>
  );
};
