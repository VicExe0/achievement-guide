import { GameFrame } from "@/components/gameframe";
import { TopBar } from "@/components/topbar";
import { Button } from "@/components/ui/button";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { ACHIEVEMENTS } from "@/constants/achievements";

import { ShineText } from "@/components/textshine";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const steamid = params.get("steamid");
        const redirect = params.get("redirect") || "/";

        if (steamid) sessionStorage.setItem("steamid", steamid.toString());
        if (steamid || redirect !== "/") navigate(redirect, { replace: true });

    }, []);

    const scroll = () => {
        document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <>
            <div className="w-screen min-h-screen flex flex-col">
                <TopBar />
                <div className="mt-[var(--topbar-height)] overflow-y-scroll hide-scrollbar">
                    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-[24px]" style={{ height: `calc(100vh - var(--topbar-height))` }}>
                        <div className="flex flex-col items-center gap-[8px]">
                            <h1 className="text-topbar-foreground font-bold text-2xl sm:text-4xl md:text-5xl">
                                Achievement<span className="text-acc">Guide</span>
                            </h1>
                            <p className="text-muted-foreground text-center">Here you will find how to <ShineText>100%</ShineText> game's achievements!</p>
                        </div>
                        <Button onClick={scroll} className="bg-acc text-black font-bold text-md cursor-pointer transition-transform duration-200 hover:scale-95 hover:bg-acc-dim w-[140px] rounded-2xl">Get Started</Button>
                    </div>
                    <div id="games" className="w-full flex items-center justify-center flex-col gap-[20px] p-[20px] bg-primary">
                        <h2 className="text-primary-foreground text-2xl sm:text-3xl">Find your game.</h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,200px))] max-w-[1300px] max-md:max-w-full gap-4  w-full justify-center mx-auto">
                            {Object.entries(ACHIEVEMENTS).map(([key, value], index) => (
                                <GameFrame key={index} href={`/guide/${key}`}>
                                    <img className="w-full h-full object-cover" src={`/achievement-guide/${key}.png`} alt={value.name} />
                                </GameFrame>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )    
}

export default Home;