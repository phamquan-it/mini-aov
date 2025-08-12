"use client";
import { Hero } from "@/lib/features/heroes/Hero";
import React from "react";

interface WrapHeroProps {
    hero: Hero;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
}

const WrapHero = ({
    hero,
    children,
    className = "",
    style = {},
    onClick
}: WrapHeroProps) => {
    return (
        <div
            className={`absolute px-2 py-1 ${className}`}
            style={{
                top: hero.position.y,
                left: hero.position.x,
                transform: "translate(-100%, -100%)",
                scale: 0.5,
                cursor: onClick ? 'pointer' : 'default',
                ...style
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default WrapHero;
