// Places on the Old City map. x/y are the pin's position on the 390×844 map.

export type Category = "monument" | "food" | "craft" | "legend";

export const CATEGORIES: Record<Category, { label: string; chip: string; color: string; tagBg: string; tagFg: string }> = {
  monument: { label: "Monument", chip: "Monuments", color: "#9A4E36", tagBg: "#F6E3DA", tagFg: "#7E3D29" },
  food: { label: "Food", chip: "Food", color: "#C0612F", tagBg: "#FBE6D6", tagFg: "#8A4318" },
  craft: { label: "Craft", chip: "Crafts", color: "#8A6424", tagBg: "#F6EEE4", tagFg: "#6E4E1E" },
  legend: { label: "Legend", chip: "Legends", color: "#5A4434", tagBg: "#EDE4DA", tagFg: "#4A3628" },
};

export type Place = {
  id: string;
  name: string;
  cat: Category;
  x: number;
  y: number;
  rating: string;
  fact: string;
  mins: number;
  km: number;
  open: string;
  img?: string;
  // Only Sidi Saiyyed has a full place page and recorded story so far.
  href?: string;
  // A description page of another kind (the Local secrets finds).
  detail?: string;
};

export const PLACES: Place[] = [
  { id: "sidi", name: "Sidi Saiyyed Mosque", cat: "monument", x: 160, y: 306, rating: "4.9", fact: "1573", mins: 22, km: 1.8, open: "Open now", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", href: "/place" },
  { id: "bhadra", name: "Bhadra Fort", cat: "legend", x: 180, y: 368, rating: "4.6", fact: "1411", mins: 18, km: 1.4, open: "Open now", img: "/images/bhadra-fort.jpg", detail: "/secret?id=bhadra" },
  { id: "teen", name: "Teen Darwaza", cat: "monument", x: 218, y: 380, rating: "4.5", fact: "1415", mins: 14, km: 1.1, open: "Always open", img: "/images/teen-darwaza.jpg", detail: "/secret?id=teen" },
  { id: "jama", name: "Jama Masjid", cat: "monument", x: 256, y: 388, rating: "4.8", fact: "1424", mins: 11, km: 0.9, open: "Open now", img: "/images/jama-masjid.jpg", detail: "/secret?id=jama" },
  { id: "manek", name: "Manek Chowk", cat: "food", x: 268, y: 432, rating: "4.7", fact: "Night market", mins: 14, km: 1.1, open: "Food from 8 PM", img: "/images/manek-chowk.jpg", detail: "/secret?id=manek" },
  { id: "dhal", name: "Dhal ni Pol woodcarvings", cat: "craft", x: 300, y: 476, rating: "4.6", fact: "Carved havelis", mins: 8, km: 0.65, open: "Best in the morning", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", detail: "/secret?id=dhal" },
  { id: "kalupur", name: "Kalupur Swaminarayan Temple", cat: "monument", x: 344, y: 290, rating: "4.7", fact: "1822", mins: 16, km: 1.3, open: "Open now", img: "/images/kalupur-temple.jpg", detail: "/secret?id=kalupur" },
];

export const placeById = (id: string) => PLACES.find((p) => p.id === id) || PLACES[0];
