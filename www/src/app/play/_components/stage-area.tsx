import GameCanvas from "./game-canvas";
import ToolBox from "./tool-box";

export default function StageArea() {

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <ToolBox />
      <GameCanvas />
    </div>
  );
}
