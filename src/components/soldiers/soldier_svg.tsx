// components/Soldier.tsx
"use client";
import { Soldier } from "@/lib/features/soldiers/Soldier";
import React from "react";

interface SoldierProps {
    soldier: Soldier;
}

export default function SoldierDiv({ soldier }: SoldierProps) {
    const { position, type, hp, maxHp, team } = soldier;

    // Màu thân lính theo team + type
    const colorMap: Record<Soldier["team"], Record<Soldier["type"], string>> = {
        ally: {
            melee: "#4caf50",
            ranged: "#2196f3",
            siege: "#ff9800",
        },
        enemy: {
            melee: "#e53935",
            ranged: "#9c27b0",
            siege: "#ff5722",
        },
    };

    const fillColor = 'blue';
    const hpPercent = Math.max(0, hp / maxHp) * 100;

    return (
        <div
            className="absolute"
            style={{
                left: position.x,
                top: position.y,
                transform: "translate(-50%, -50%)",
            }}
        >
            {/* Thanh máu */}
            <div
                style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 3,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 1,
                }}
            >
                <div
                    style={{
                        width: `${hpPercent}%`,
                        height: "100%",
                        backgroundColor:
                            hpPercent > 50
                                ? "#4caf50"
                                : hpPercent > 25
                                    ? "#ffeb3b"
                                    : "#f44336",
                        borderRadius: 1,
                    }}
                />
            </div>

            {/* Thân lính */}
            <div
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: fillColor,
                    border: "1px solid black",
                }}
            />
        </div>
    );
}

