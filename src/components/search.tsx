import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";

import { ACHIEVEMENTS } from "@/constants/achievements.tsx";

export const Search = () => {
    const navigate = useNavigate();

    return (
        <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Games">
                    {Object.entries(ACHIEVEMENTS).map(([key, value], index) => 
                        <CommandItem key={index} className="rounded-[8px]">
                            <button className="w-full h-full text-left cursor-pointer" onClick={() => navigate(`/guide/${key}`)}>{value.name}</button>
                        </CommandItem>
                    )}
                </CommandGroup>
                {Object.entries(ACHIEVEMENTS).map(([game, data]) => (
                    <Fragment key={game}>
                        <CommandSeparator />
                        <CommandGroup heading={`${data.name} Achievements`}>
                        {data.achievements.map((achievement) => (
                            <CommandItem key={game + achievement.title} className="rounded-[8px]">
                                <button className="w-full h-full text-left cursor-pointer" onClick={() => navigate(`/guide/${game}#${achievement.id}`)}>
                                    {achievement.title}
                                </button>
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </Fragment>
                ))}
            </CommandList>
        </Command>
    )
}