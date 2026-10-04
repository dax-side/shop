// Same palette as the website (src/app/globals.css), plus a dark version for night use.
export const light = {
  paper: "#f1efea",
  ink: "#171614",
  muted: "#5f5b54",
  line: "#d9d5cd",
  accent: "#c23b1e",
  onAccent: "#ffffff",
  surface: "#fbfaf7",
  bar: "#e9e6df",
  sand: ["#d8cfc0", "#e3ded6", "#e7e3dc", "#dbd6cd", "#d3c9b8"],
};

export type Palette = typeof light;

export const dark: Palette = {
  paper: "#171614",
  ink: "#f1efea",
  muted: "#a8a298",
  line: "#3a3732",
  accent: "#e0583a",
  onAccent: "#ffffff",
  surface: "#211f1c",
  bar: "#1f1d1a",
  sand: ["#3b362f", "#34302b", "#2f2c28", "#36322c", "#40392f"],
};
