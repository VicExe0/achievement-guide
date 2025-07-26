import { type ReactNode } from "react";

export type Achievement = {
  title: string
  description: string
  id: string
  image: string
  badges: [ string, string ][]
  content?: ReactNode
};

export type GameAchievements = {
  name: string
  appid: number
  completed: boolean
  achievements: Achievement[]
};

const modules = import.meta.glob("@/docs/*.tsx", { eager: true });

export const ACHIEVEMENTS: Record<string, GameAchievements> = {};

for (const path in modules) {
    const key = path.split("/").pop()?.replace(".tsx", "");

    if (!key) continue;

    ACHIEVEMENTS[key] = ( modules[path] as any).default;
}