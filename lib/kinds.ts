// One look per kind of stop or find, shared by the trip planner and Discover:
// a colour pair and an icon (SVG path data, 24×24, stroked).
export type Look = { fg: string; bg: string; icon: string };

export const KIND_LOOK: Record<string, Look> = {
  heritage: { fg: "#9A4E36", bg: "#F6E3DA", icon: "M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z" },
  food: { fg: "#B5541E", bg: "#FBE7D6", icon: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" },
  hidden: { fg: "#8A6424", bg: "#F6EEE4", icon: "M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20" },
  nature: { fg: "#2F7A4A", bg: "#E3F1E7", icon: "m8 3 4 8 5-5 5 15H2L8 3z" },
  spiritual: { fg: "#7A4E9A", bg: "#F1E8F6", icon: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" },
  market: { fg: "#3457C9", bg: "#EEF2FE", icon: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" },
  rest: { fg: "#6F5B4B", bg: "#F1E7DA", icon: "M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2" },
  festival: { fg: "#B03A6B", bg: "#FBE5EE", icon: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" },
  experience: { fg: "#2B7A85", bg: "#E1F2F3", icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" },
  photo: { fg: "#5A4434", bg: "#F1E7DA", icon: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" },
  stories: { fg: "#8A6424", bg: "#F6EEE4", icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" },
};

// Planner interests share the kinds' icons (markets → market, and so on).
export const lookOf = (kind: string): Look => KIND_LOOK[kind] ?? KIND_LOOK[kind.replace(/s$/, "")] ?? KIND_LOOK.heritage;
