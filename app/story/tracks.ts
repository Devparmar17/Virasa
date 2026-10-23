// Everything the player can play, in the order it plays them: the full Sidi
// Saiyyed story first, then a short listen for each place. A short listen is
// split into sentences so it gets the same live transcript as the full story.
import { SECRETS } from "@/lib/secrets";
import { buildCues, CHAPTERS, type Cue, type Depth, type Lang } from "./script";

export type Track = {
  id: string;
  title: string;
  place: string;
  img: string;
  alt: string;
  chapters: string[];
  langs: Lang[];
  // Only the full story comes in quick, classic and deep versions.
  depths: boolean;
  page: string;
  build: (depth: Depth) => { cues: Cue[]; total: number; chapterStarts: number[] };
};

const SIDI_IMG = "/images/a9558385034112d0e27f39ea353dd7ed.jpg";

const sidi: Track = {
  id: "sidi",
  title: "The Tree of Life",
  place: "Sidi Saiyyed Mosque",
  img: SIDI_IMG,
  alt: "Tree of Life jali",
  chapters: CHAPTERS,
  langs: ["en", "hi", "gu"],
  depths: true,
  page: "/place",
  build: buildCues,
};

// Roughly how long a sentence takes to say, at an unhurried narrating pace.
const secondsFor = (sentence: string) => Math.max(3, Math.round((sentence.split(/\s+/).length / 2.6) * 10) / 10);

const short: Track[] = SECRETS.map((s) => {
  const sentences = s.story.join(" ").match(/[^.!?]+[.!?]+["”’']?/g)?.map((x) => x.trim()) ?? s.story;
  return {
    id: s.id,
    title: s.title,
    place: s.tag,
    img: s.img || SIDI_IMG,
    alt: s.alt,
    chapters: [s.title],
    langs: ["en"],
    depths: false,
    page: `/secret?id=${s.id}`,
    build: () => {
      let at = 0;
      const cues = sentences.map((line) => {
        const cue = { at, ch: 0, text: { en: line, hi: line, gu: line } };
        at += secondsFor(line);
        return cue;
      });
      return { cues, total: at, chapterStarts: [0] };
    },
  };
});

export const TRACKS: Track[] = [sidi, ...short];
export const track = (id: string | null) => TRACKS.find((t) => t.id === id) || sidi;
export const nextTrack = (id: string) => {
  const i = TRACKS.findIndex((t) => t.id === id);
  return i >= 0 && i < TRACKS.length - 1 ? TRACKS[i + 1] : null;
};
