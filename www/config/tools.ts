export type Tool = {
  id: string;
  label: string;
  emoji: string;
  cost: number;
  size: number;
};

export const TOOLS: Tool[] = [
  {
    id: "residential",
    label: "Residential",
    emoji: "🏚️",
    cost: 100,
    size: 3,
  },
  {
    id: "commercial",
    label: "Commercial",
    emoji: "🏢",
    cost: 100,
    size: 3,
  },
  {
    id: "industrial",
    label: "Industrial",
    emoji: "🏭",
    cost: 100,
    size: 3,
  },
  {
    id: "fire-station",
    label: "Fire Station",
    emoji: "🚒",
    cost: 500,
    size: 3,
  },
  {
    id: "police-station",
    label: "Police Station",
    emoji: "🚓",
    cost: 500,
    size: 3,
  },
  {
    id: "inspect",
    label: "Inspect",
    emoji: "🔎",
    cost: 0,
    size: 1,
  },
  {
    id: "wire",
    label: "Wire",
    emoji: "🔌",
    cost: 5,
    size: 1,
  },
  {
    id: "bulldozer",
    label: "Bulldozer",
    emoji: "🚜",
    cost: 1,
    size: 1,
  },
  {
    id: "railroad",
    label: "Railroad",
    emoji: "🚂",
    cost: 20,
    size: 1,
  },
  {
    id: "road",
    label: "Road",
    emoji: "🚗",
    cost: 10,
    size: 1,
  },
  {
    id: "stadium",
    label: "Stadium",
    emoji: "🏟️",
    cost: 5000,
    size: 4,
  },
  {
    id: "park",
    label: "Park",
    emoji: "🌴",
    cost: 10,
    size: 1,
  },
  {
    id: "seaport",
    label: "Seaport",
    emoji: "🚢",
    cost: 3000,
    size: 4,
  },
  {
    id: "coal-power",
    label: "Coal Power",
    emoji: "🔋",
    cost: 3000,
    size: 4,
  },
  {
    id: "nuclear-power",
    label: "Nuclear Power",
    emoji: "☢️",
    cost: 5000,
    size: 4,
  },
  {
    id: "airport",
    label: "Airport",
    emoji: "✈️",
    cost: 10000,
    size: 6,
  },
  {
    id: "network",
    label: "Network",
    emoji: "🚜",
    cost: 100,
    size: 1,
  },
  {
    id: "water",
    label: "Water",
    emoji: "💧",
    cost: 0,
    size: 1,
  },
  {
    id: "land",
    label: "Land",
    emoji: "⛰️",
    cost: 0,
    size: 1,
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌳",
    cost: 0,
    size: 1,
  },
];
