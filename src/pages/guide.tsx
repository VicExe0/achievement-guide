import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { TopBar } from "@/components/topbar";
import { SideBar } from "@/components/sidebar";

import GamePage from "@/components/gamepage";

const Guide = () => {
    const { game } = useParams<{ game: string }>();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    if (!game) return <div className="text-red-500">Game not found.</div>

    return (
        <>
            <SidebarProvider>
                <div className="w-screen min-h-screen flex flex-col">
                    <TopBar />
                    <div className="relative mt-[48px] flex">
                        <SideBar game={game} className="fixed top-[48px] w-64 flex-shrink-0" />
                        <main className="relative p-2 flex-1 overflow-y-scroll hide-scrollbar">
                            <div className="fixed left-2 z-50 md:hidden w-[40px] h-[40px] bg-muted shadow-md rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-accent">
                                <SidebarTrigger className="cursor-pointer transition-colors duration-200 hover:bg-accent" />
                            </div>
                            <div className="flex flex-col gap-3 px-11 md:px-0">
                                <GamePage game={game}/>
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </>
    )    
}

export default Guide;