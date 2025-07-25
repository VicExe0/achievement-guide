import React from "react"

import { Badge } from "@/components/ui/badge";

export const GreenBadge = ({ children }: { children: React.ReactNode }) => {
    return <Badge variant="default" className="bg-green-600 text-white rounded-2xl">{children}</Badge>
}

export const YellowBadge = ({ children }: { children: React.ReactNode }) => {
    return <Badge variant="default" className="bg-yellow-300 text-black rounded-2xl">{children}</Badge>
}

export const RedBadge = ({ children }: { children: React.ReactNode }) => {
    return <Badge variant="default" className="bg-red-600 text-white rounded-2xl">{children}</Badge>
}

export const BlueBadge = ({ children }: { children: React.ReactNode }) => {
    return <Badge variant="default" className="bg-indigo-700 text-white rounded-2xl">{children}</Badge>
}