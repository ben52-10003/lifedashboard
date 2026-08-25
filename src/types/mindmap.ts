import type {
  JournalActivity,
  JournalState,
  LifeAlternative,
  MindMap,
  MindMapKind,
  MindMapNode,
} from "./dashboard";

export const MIND_MAP_INTRO =
  "If you didn’t keep a Good Time Journal, go back and do that first—you are about to mine it. Mind mapping is how you get from those engaged, energized, in-flow moments to unexpected ideas for a life. Make three different maps, then invent a life alternative from each.";

export const MIND_MAP_PROMPT =
  "Push each map out three or four layers, with a dozen or more elements in the outermost ring. Don’t overthink—write the next word that comes to mind.";

export const MIND_MAP_STEPS: string[] = [
  "Make three different mind maps, each with a different center from your Good Time Journal.",
  "Mind Map 1—Engagement: pick an activity where you were highly engaged. Put it in the center and branch out with connected words and concepts.",
  "Mind Map 2—Energy: pick something that was really energizing. Put it in the center and map from there.",
  "Mind Map 3—Flow: pick an experience where you were in a state of flow. Put it in the center and finish the map.",
  "Look at the outer ring of a map and pick three disparate items that jump out at you.",
  "Combine those three into a possible job description that would be fun for you and helpful to someone else—it need not be practical.",
  "Name the role and draw a napkin sketch of it.",
  "Do this three times, once for each map, and make the three versions different from one another.",
];

export interface MindMapKindConfig {
  kind: MindMapKind;
  number: number;
  title: string;
  intro: string;
  centerPlaceholder: string;
}

export const MIND_MAP_KIND_CONFIGS: MindMapKindConfig[] = [
  {
    kind: "engagement",
    number: 1,
    title: "Engagement",
    intro:
      "Pick one area of greatest interest, or an activity from your Good Time Journal where you were highly engaged—balancing the budget, pitching a new idea. Put it at the center and generate connected words using mind-mapping.",
    centerPlaceholder: "An activity where you were highly engaged…",
  },
  {
    kind: "energy",
    number: 2,
    title: "Energy",
    intro:
      "Pick something from your journal that was really energizing in your work or life—art class, giving feedback. Put it at the center and map outward.",
    centerPlaceholder: "Something that really energized you…",
  },
  {
    kind: "flow",
    number: 3,
    title: "Flow",
    intro:
      "Pick one experience from your journal where you were in a state of flow—speaking in front of a large audience, brainstorming creative ideas. Put it at the center and complete the map.",
    centerPlaceholder: "A time you were in flow…",
  },
];

export const ALTERNATIVE_INTRO =
  "When the map has an outer ring, invent an interesting—though not necessarily practical—life alternative from it.";

export const ALTERNATIVE_STEPS: string[] = [
  "Look at the outer ring and pick three disparate items that catch your eye. You’ll know them intuitively—they should jump out at you.",
  "Combine those three items into a possible job description that would be fun and interesting to you and would be helpful to someone else (it need not be practical or appeal to lots of employers).",
  "Name your role and draw a napkin sketch of it—a quick visual of what it is. Grant, mapping from hiking, pickup basketball, and helping his niece and nephew, sketched himself leading a Pirate Surf Camp for children.",
];

export const ROLE_PLACEHOLDER = "Name this role…";
export const JOB_PLACEHOLDER =
  "Combine your three outer-ring picks into a job description that’s fun for you and useful to someone else…";
export const BRANCH_PLACEHOLDER = "A connected word or idea…";

export function addChildNode(
  root: MindMapNode,
  parentId: string,
  label: string,
): MindMapNode {
  const child: MindMapNode = {
    id: crypto.randomUUID(),
    label,
    children: [],
  };

  function walk(node: MindMapNode): MindMapNode {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, child] };
    }
    return { ...node, children: node.children.map(walk) };
  }

  return walk(root);
}

export function renameNode(
  root: MindMapNode,
  id: string,
  label: string,
): MindMapNode {
  function walk(node: MindMapNode): MindMapNode {
    const current = node.id === id ? { ...node, label } : node;
    return { ...current, children: current.children.map(walk) };
  }
  return walk(root);
}

export function removeNode(root: MindMapNode, id: string): MindMapNode {
  if (root.id === id) return root;
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => removeNode(child, id)),
  };
}

export function findNode(
  root: MindMapNode,
  id: string,
): MindMapNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return undefined;
}

export function collectIds(root: MindMapNode): Set<string> {
  const ids = new Set<string>();
  function walk(node: MindMapNode) {
    ids.add(node.id);
    node.children.forEach(walk);
  }
  walk(root);
  return ids;
}

export function treeMaxDepth(root: MindMapNode): number {
  if (root.children.length === 0) return 0;
  return 1 + Math.max(...root.children.map(treeMaxDepth));
}

export function countNodes(root: MindMapNode): number {
  return 1 + root.children.reduce((sum, child) => sum + countNodes(child), 0);
}

export function outerNodes(root: MindMapNode): MindMapNode[] {
  const maxDepth = treeMaxDepth(root);
  if (maxDepth === 0) return [];
  const result: MindMapNode[] = [];
  function walk(node: MindMapNode, depth: number) {
    if (depth === maxDepth) result.push(node);
    node.children.forEach((child) => walk(child, depth + 1));
  }
  walk(root, 0);
  return result;
}

export function prunePickedIds(root: MindMapNode, pickedIds: string[]): string[] {
  const ids = collectIds(root);
  const outer = new Set(outerNodes(root).map((node) => node.id));
  return pickedIds.filter((id) => ids.has(id) && outer.has(id));
}

function leafWeight(node: MindMapNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + leafWeight(child), 0);
}

export interface PlacedNode {
  id: string;
  label: string;
  x: number;
  y: number;
  depth: number;
  parentX: number;
  parentY: number;
  isRoot: boolean;
  isOuter: boolean;
}

export function layoutMindMap(
  root: MindMapNode,
  width: number,
  height: number,
): PlacedNode[] {
  const placed: PlacedNode[] = [];
  const maxDepth = treeMaxDepth(root);
  const cx = width / 2;
  const cy = height / 2;

  function walk(
    node: MindMapNode,
    depth: number,
    startAngle: number,
    endAngle: number,
    parentX: number,
    parentY: number,
  ) {
    const angle = (startAngle + endAngle) / 2;
    const radius = depth === 0 ? 0 : 110 + depth * 108;
    const x = depth === 0 ? cx : cx + Math.cos(angle) * radius;
    const y = depth === 0 ? cy : cy + Math.sin(angle) * radius;

    placed.push({
      id: node.id,
      label: node.label,
      x,
      y,
      depth,
      parentX,
      parentY,
      isRoot: depth === 0,
      isOuter: maxDepth > 0 && depth === maxDepth,
    });

    if (node.children.length === 0) return;

    const total = leafWeight(node);
    let cursor = startAngle;
    for (const child of node.children) {
      const span = ((endAngle - startAngle) * leafWeight(child)) / total;
      walk(child, depth + 1, cursor, cursor + span, x, y);
      cursor += span;
    }
  }

  walk(root, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2, cx, cy);
  return placed;
}

export interface JournalPick {
  id: string;
  date: string;
  name: string;
  engaged: JournalActivity["engaged"];
  energized: JournalActivity["energized"];
}

export function flattenJournalActivities(journal: JournalState): JournalPick[] {
  return journal.logs.flatMap((log) =>
    log.activities
      .filter((activity) => activity.name.trim())
      .map((activity) => ({
        id: activity.id,
        date: log.date,
        name: activity.name,
        engaged: activity.engaged,
        energized: activity.energized,
      })),
  );
}

export function suggestedPicks(
  kind: MindMapKind,
  activities: JournalPick[],
): JournalPick[] {
  const ranked = [...activities];
  if (kind === "engagement") {
    ranked.sort((a, b) => b.engaged - a.engaged || b.energized - a.energized);
  } else if (kind === "energy") {
    ranked.sort((a, b) => b.energized - a.energized || b.engaged - a.engaged);
  } else {
    ranked.sort(
      (a, b) =>
        b.engaged + b.energized - (a.engaged + a.energized) ||
        b.engaged - a.engaged,
    );
  }
  return ranked.slice(0, 8);
}

export function mapStats(map: MindMap): {
  depth: number;
  outerCount: number;
  branchCount: number;
} {
  return {
    depth: treeMaxDepth(map.root),
    outerCount: outerNodes(map.root).length,
    branchCount: Math.max(0, countNodes(map.root) - 1),
  };
}

export function alternativeProgress(alternative: LifeAlternative): {
  picks: number;
  hasRole: boolean;
  hasJob: boolean;
  hasSketch: boolean;
} {
  return {
    picks: alternative.pickedIds.length,
    hasRole: alternative.roleName.trim().length > 0,
    hasJob: alternative.jobDescription.trim().length > 0,
    hasSketch: alternative.napkinSketch.length > 0,
  };
}
