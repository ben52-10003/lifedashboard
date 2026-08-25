import { layoutMindMap } from "../types/mindmap";
import type { MindMapNode } from "../types/dashboard";

interface MindMapCanvasProps {
  root: MindMapNode;
  selectedId: string;
  pickedIds: string[];
  onSelect: (id: string) => void;
  onTogglePick: (id: string) => void;
}

const LAYOUT = 960;
const MIN_VIEW_W = 440;
const MIN_VIEW_H = 280;
const VIEW_PAD = 48;

function wrapWords(text: string, maxChars: number): string[] {
  const raw = text.trim() || "Add a center…";
  const words = raw.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (line) {
        lines.push(line);
        line = "";
      }
      for (let i = 0; i < word.length; i += maxChars) {
        const piece = word.slice(i, i + maxChars);
        if (i + maxChars >= word.length) line = piece;
        else lines.push(piece);
      }
      continue;
    }
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function nodeMetrics(label: string, isRoot: boolean) {
  const lines = wrapWords(label, isRoot ? 22 : 16);
  const fontSize = isRoot ? 17 : 14;
  const lineHeight = isRoot ? 22 : 18;
  const padX = isRoot ? 22 : 14;
  const padY = isRoot ? 14 : 10;
  const charWidth = isRoot ? 9.2 : 7.8;
  const textWidth = Math.max(...lines.map((line) => line.length)) * charWidth;
  const width = Math.min(isRoot ? 320 : 220, Math.max(isRoot ? 168 : 96, textWidth + padX * 2));
  const height = lines.length * lineHeight + padY * 2;
  return { lines, width, height, lineHeight, fontSize };
}

export function MindMapCanvas({
  root,
  selectedId,
  pickedIds,
  onSelect,
  onTogglePick,
}: MindMapCanvasProps) {
  const placed = layoutMindMap(root, LAYOUT, LAYOUT);
  const picked = new Set(pickedIds);
  const metrics = new Map(
    placed.map((node) => [node.id, nodeMetrics(node.label, node.isRoot)]),
  );

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of placed) {
    const box = metrics.get(node.id)!;
    minX = Math.min(minX, node.x - box.width / 2);
    minY = Math.min(minY, node.y - box.height / 2);
    maxX = Math.max(maxX, node.x + box.width / 2);
    maxY = Math.max(maxY, node.y + box.height / 2);
  }

  const contentW = Math.max(MIN_VIEW_W, maxX - minX + VIEW_PAD * 2);
  const contentH = Math.max(MIN_VIEW_H, maxY - minY + VIEW_PAD * 2);
  const viewX = (minX + maxX) / 2 - contentW / 2;
  const viewY = (minY + maxY) / 2 - contentH / 2;

  return (
    <div className="mindmap-canvas-wrap">
      <svg
        className="mindmap-canvas"
        viewBox={`${viewX} ${viewY} ${contentW} ${contentH}`}
        role="img"
        aria-label="Mind map"
      >
        {placed
          .filter((node) => !node.isRoot)
          .map((node) => (
            <line
              key={`line-${node.id}`}
              x1={node.parentX}
              y1={node.parentY}
              x2={node.x}
              y2={node.y}
              className="mindmap-link"
            />
          ))}
        {placed.map((node) => {
          const box = metrics.get(node.id)!;
          const selected = node.id === selectedId;
          const isPicked = picked.has(node.id);
          const className = [
            "mindmap-node",
            node.isRoot ? "mindmap-node--root" : "",
            node.isOuter ? "mindmap-node--outer" : "",
            selected ? "mindmap-node--selected" : "",
            isPicked ? "mindmap-node--picked" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const textStart = -((box.lines.length - 1) * box.lineHeight) / 2 + box.fontSize * 0.35;

          return (
            <g
              key={node.id}
              className={className}
              transform={`translate(${node.x} ${node.y})`}
            >
              <rect
                x={-box.width / 2}
                y={-box.height / 2}
                width={box.width}
                height={box.height}
                rx={Math.min(24, box.height / 2)}
              />
              <text textAnchor="middle" style={{ fontSize: box.fontSize }}>
                {box.lines.map((line, index) => (
                  <tspan key={`${node.id}-${index}`} x={0} y={textStart + index * box.lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
              <title>{node.label || "Center"}</title>
              <rect
                x={-box.width / 2}
                y={-box.height / 2}
                width={box.width}
                height={box.height}
                rx={Math.min(24, box.height / 2)}
                className="mindmap-hit"
                onClick={() => onSelect(node.id)}
                onDoubleClick={() => {
                  if (node.isOuter) onTogglePick(node.id);
                }}
              />
            </g>
          );
        })}
      </svg>
      <p className="mindmap-canvas-hint">
        Click a node to select it. Double-click an outer-ring word to pick it for
        a life alternative (up to three).
      </p>
    </div>
  );
}
