"use client";
import { Stage } from "@pixi/react";
import { FC, useState } from "react";
import { Hex } from "viem";
import { Map } from "./Map";
import { ToolOverlay } from "./ToolOverlay";
import { ToolBox } from "./ToolBox";

export type GameStageProps = {
    map?: Hex;
};

export const GameStage: FC<GameStageProps> = ({ map }) => {
    const width = 120;
    const height = 100;
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [tool, setTool] = useState(0);

    return (
        <div className="flex h-screen overflow-hidden w-full h-full">
            {/* ToolBox Section */}
            <div className="w-1/5 bg-gray-800 p-4 border-r shadow-lg overflow-y-auto">
                <ToolBox value={tool} onChange={setTool} />
            </div>

            {/* Stage Section */}
            <div className="flex-1 overflow-auto bg-gray-100">
                <Stage width={width * 16} height={height * 16}>
                    <Map
                        value={map}
                        scale={1}
                        onMouseMove={(tile) => {
                            setX(tile.x);
                            setY(tile.y);
                        }}
                    />
                    <ToolOverlay tool={tool} x={x} y={y} />
                </Stage>
            </div>
        </div>
    );
};
