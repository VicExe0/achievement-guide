import { CommandDialog, CommandShortcut } from "@/components/ui/command";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

import { Search } from "@/components/search";
import { ThemeSwitch } from "./themeswitch";
import { Github } from "./github";
import { Steam } from "./steam";

export const TopBar = () => {
    const navigate = useNavigate();
    const [ open, setOpen ] = useState(false);

    useEffect(() => {
        const down = ( e: KeyboardEvent ) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);

        return () => document.removeEventListener("keydown", down);
    }, [])

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen} className="rounded-[8px]">
                <Search />
            </CommandDialog>
            <div className="w-screen h-[var(--topbar-height)] z-50 flex text-secondary-foreground px-2.5 items-center justify-between bg-topbar fixed">
                <div className="flex items-center w-[50%]">
                    <div className="flex items-center gap-1.5 cursor-pointer transition-transform duration-200 hover:scale-95" onClick={() => navigate("/")}>
                        <img src="/achievement-guide/favicon.svg" alt="logo" className="max-w-[32px] max-h-[32px]" />
                        <span className="text-topbar-foreground font-bold">
                            Achievement<span className="text-acc">Guide</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center w-[50%] justify-end-safe">
                    <Steam />
                    <button onClick={() => setOpen(true)} className="flex items-center gap-[0.5rem] cursor-pointer transition-transform duration-200 hover:scale-95">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"/></svg>
                        <CommandShortcut className="hidden sm:inline">ctrl+K</CommandShortcut>
                    </button>
                    <Github />
                    <ThemeSwitch />
                </div>
            </div>
        </>
    )
}