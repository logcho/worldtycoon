"use client";

import { FC } from "react";
import { tools } from "../models/Tool";

export type ToolBoxProps = {
    value: number;
    onChange?: (value: number) => void;
};

export const ToolBox: FC<ToolBoxProps> = ({ value, onChange }) => {
    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

    return (
        <div className="space-y-4">
            {tools.map((tool, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
                        value === index ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
                    }`}
                    onClick={() => onChange && onChange(index)}
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl">{tool.emoji}</span>
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg">{tool.label}</span>
                        </div>
                    </div>
                    <div
                        className={`text-sm font-medium px-2 py-1 rounded ${
                            value === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {currencyFormatter.format(tool.cost)}
                    </div>
                </div>
            ))}
        </div>
    );
};
