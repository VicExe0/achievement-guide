import { useState, useEffect, type ReactNode } from "react";

import { CheckMark } from "./checkmark";

import "@/assets/styles/achievementcontainer.css";

type AchievementBoxType = {
    title: string
    description: string
    image: string
    children?: ReactNode
    checked: boolean
    onToggle: ( val: boolean ) => void 
};

type AchievementSectionType = {
    id: string
    defaultChecked: boolean
    children: (
        checked: boolean,
        setChecked: ( val: boolean ) => void
    ) => ReactNode 
}

export const AchievementBox = ({ title, description, image, children, checked, onToggle }: AchievementBoxType) => {
    return (
        <div className="flex min-h-[var(--achievement-height)] p-2 gap-1 bg-popover text-popover-foreground w-full rounded-[8px]">
            <div className="flex flex-row gap-3 justify-evenly items-center min-w-[68px] h-[68px] shrink-0">
                <CheckMark className="mx-1" onChange={onToggle} checked={checked} />
                <img className="max-w-[64px] max-h-[64px] object-contain" src={image} alt="Achievement icon" />
            </div>
            <div className="flex flex-col justify-center px-2 min-w-0">
                <div className="flex gap-1">
                    {children}
                </div>
                <h3 className="font-bold whitespace-break-spaces">{title}</h3>
                <p className="text-gray-400 whitespace-break-spaces">{description}</p>
            </div>
        </div>
    )
}

export const AchievementSection = ({ id, defaultChecked = false, children }: AchievementSectionType) => {
    const [checked, setChecked] = useState(defaultChecked);

    useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    return (
        <section id={id} className={`flex flex-col gap-1 transition-opacity duration-200 ${checked ? "opacity-50" : "opacity-100"}`}>
            {children(checked, setChecked)}
        </section>
    )
}