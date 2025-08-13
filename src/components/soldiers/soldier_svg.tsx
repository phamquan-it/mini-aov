// components/Soldier.tsx
"use client";
import { Soldier } from "@/lib/features/soldiers/useSoldiersStore";
import React from "react";

interface SoldierProps {
    soldier: Soldier;
}

export default function SoldierDiv({ soldier }: SoldierProps) {
    const { position } = soldier;

    // Màu thân lính theo team + type

    const fillColor = 'blue';

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
                        height: "100%",
                        backgroundColor: fillColor,
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

