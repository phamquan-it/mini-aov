"use client";
import React from "react";

interface SoldierProps {
    position: { x: number; y: number };
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const Soldier = ({
    position,
    className = "",
    style = {},
    children = "Soldier"
}: SoldierProps) => {
    return (
        <div
            className={`absolute bg-blue-700 text-white px-2 py-1 rounded ${className}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "translate(-50%, -50%)",
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default Soldier;
