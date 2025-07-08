import { bitmap, fixedsys } from "@/lib/fonts";
import type { Tool } from "@/config/tools";

type ToolProps = {
  tool: Tool;
  selected: boolean;
  onSelect: (tool: Tool) => void;
};

export default function ToolCard({ tool, selected, onSelect }: ToolProps) {
  return (
    <div
      onClick={() => onSelect(tool)}
      className={`
        ${bitmap.className}
        flex flex-row items-center justify-center gap-2
        cursor-pointer rounded-md border px-4 py-2 text-3xl transition hover:shadow-md
        bg-neutral-800
        ring-offset-background
        ${selected ? "ring-2 ring-yellow-500 ring-offset-2" : ""}
      `}
    >
      <span>{tool.emoji}</span>
      <span className="truncate font-medium">{tool.label}</span>
      <span
        className={`
          ${fixedsys.className}
          bg-foreground/10 ml-auto rounded-md px-2 py-1 text-sm font-medium shadow-sm
        `}
      >
        ${tool.cost}
      </span>
    </div>
  );
}
