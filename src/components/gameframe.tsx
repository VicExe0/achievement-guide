import React, { forwardRef } from "react";
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props<T extends ElementType> = {
    as?: T
    children?: ReactNode
    innerClassName?: string
} & ComponentPropsWithoutRef<T>

export const GameFrame = forwardRef( function <T extends ElementType = "div">(props: Props<T>, ref: React.Ref<any> ) {
    const { as, href, children, ...rest } = props;

    const Component = as ? as : href ? Link  : "div";
    return (
        <Component to={href} ref={ref} {...rest}>
            <div className="w-full h-full max-w-[200px] max-h-[300px] transition-transform transform-gpu duration-300 ease-out hover:-translate-y-1 hover:scale-102 hover:-rotate-x-[10deg] hover:shadow-2xl">
                {children}
            </div>
        </Component>
    );
});