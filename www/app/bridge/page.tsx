import * as React from "react";

import { BridgeTabs } from "./_components/brige-tabs";

const BridgePage: React.FC = () => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
      <BridgeTabs />
    </div>
  );
};

export default BridgePage;
