import "@/assets/styles/textshine.css";
import { type ReactNode } from "react";

export const ShineText = ({ children, className } : { children?: ReactNode, className?: string}) => {
    return <span className={`${className ?? ""} shine`}>{children}</span>
}