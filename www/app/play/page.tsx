import * as React from "react";

import { StageArea } from "./_components/stage-area";
import { ToolsSidebar } from "./_components/tools-sidebar";

const PlayPage: React.FC = () => {
  return (
    <div className="w-dvh flex">
      <ToolsSidebar className="w-1/5" />
      <StageArea className="!w-4/5" />
    </div>
  );
};

export default PlayPage;
