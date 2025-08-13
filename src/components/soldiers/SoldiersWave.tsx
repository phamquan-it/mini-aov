// /components/SoldiersWave.tsx
"use client";
import React, { useEffect } from "react";
import { useSoldiersStore } from "@/lib/features/soldiers/useSoldiersStore";
import SoldierSvg from "./soldier_svg";

export default function SoldiersWave() {
    const {
        soldierIds,
        soldiers,
        startAutoSpawn,
        waveNumber,
    } = useSoldiersStore();

    // Start auto-spawning when component mounts
    useEffect(() => {
        startAutoSpawn();
    }, [startAutoSpawn]);

    return (
        <>
            {/* Render all soldiers */}
            {soldierIds.map(id => {
                const s = soldiers[id];
                return <SoldierSvg key={id} soldier={s} />;
            })}

            {/* Wave number display */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-sm rounded">
                Wave: {waveNumber + 1}
            </div>
        </>
    );
}

