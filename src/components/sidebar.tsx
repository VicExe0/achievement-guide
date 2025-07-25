import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import { ACHIEVEMENTS } from "@/constants/achievements";

import type { GameAchievements, Achievement } from "@/constants/achievements";

export const SideBar = ({ game, className }: { game: string; className?: string }) => {
    const data: GameAchievements | undefined = ACHIEVEMENTS[game as keyof typeof ACHIEVEMENTS];
    const achievements: Achievement[] = data?.achievements ?? [];

    const scroll = ( e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, section: string) => {
        e.preventDefault();
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return (
        <Sidebar variant="sidebar" className={`${className ?? ""} sm:flex`}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Achievements</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {achievements.map(item => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <a href={`#${item.id}`} onClick={(e) => scroll(e, item.id)}>{item.title}</a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
