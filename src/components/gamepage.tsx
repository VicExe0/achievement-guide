import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react";
import axios from "axios";

import { ACHIEVEMENTS, type Achievement } from "@/constants/achievements";

import { GreenBadge, YellowBadge, RedBadge, BlueBadge } from "./badges";
import { AchievementBox, AchievementSection } from "./achievementcontainer";
import PageNotFound from "./pagenotfound";

const badgeMap = {
  green: GreenBadge,
  yellow: YellowBadge,
  red: RedBadge,
  blue: BlueBadge
} as const;

const getBadge = (color: string, text: string, index: number) => {
  const Badge = badgeMap[color as keyof typeof badgeMap];
  return Badge ? <Badge key={index}>{text}</Badge> : null;
}

type SteamAchievement = {
  name: string
  defaultvalue: number
  displayName: string
  hidden: number
  icon: string
  icongray: string
  achieved: number
  unlocktime: number
}
const GamePage = ({ game } : { game: string }) => {
    const [ userAchievements, setUserAchievements ] = useState<SteamAchievement[]>([]);
    const [ gameAchievements, setGameAchievements ] = useState<Achievement[]>([]);
    const [ achievedSet, setAchievedSet ] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            const gameinfo = ACHIEVEMENTS[game];
            if (!gameinfo) return;

            const steamid = sessionStorage.getItem("steamid");
            const appid = gameinfo?.appid;

            if (steamid && appid) {
                const response = await axios.get("https://bold-union-9a07.goldenowy23.workers.dev/getachievements", {
                    params: { steamid, appid },
                    validateStatus: () => true
                });

                if (response.status === 200) setUserAchievements(response.data);
            }

            setGameAchievements(gameinfo.achievements);
        }

        fetchData();
    }, [game]);

    useEffect(() => {
        setAchievedSet(new Set(userAchievements.filter(a => a.achieved === 1).map(a => a.name)));
    }, [userAchievements]);

    const isChecked = (id: string) => achievedSet.has(id);

    if (!ACHIEVEMENTS[game]) return <PageNotFound />

    return (
        <>
            {gameAchievements.map((item, index) => (
                <React.Fragment key={index}>
                    <AchievementSection id={item.id} defaultChecked={isChecked(item.id)}>
                        {(checked, setChecked) => (
                            <>
                                <div className="w-full">
                                    <AchievementBox title={item.title} description={item.description} image={item.image} checked={checked} onToggle={setChecked}>
                                        {item.badges.map(([color, text], badge_index) =>
                                            getBadge(color, text, badge_index)
                                        )}
                                    </AchievementBox>
                                </div>
                                <div className="bg-popover text-popover-foreground rounded-[8px] p-2 flex flex-col">
                                    {item.content ?? null}
                                </div>
                            </>
                        )}
                    </AchievementSection>
                    <Separator />
                </React.Fragment>
            ))}
        </>
    )
}

export default GamePage;