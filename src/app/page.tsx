"use client";
import React, { useState, useEffect, useRef } from "react";
import Terrain from "@/maps/terrain";
import MapWrapper from "@/MapWrapper";
import { positionAtTime } from "@/utils";
import SvgPlayer from "@/SvgPlayer";
import { NakSVGInline } from "@/heros/Nakroth";
import { MuradSVGInline } from "@/heros/murad";
import { endPos, speed as soldierSpeed, startPos } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import AOVSettingsDropdown from "@/components/AOVSettingsDropdown";
import useHeroesStore from "@/lib/features/heroes/useHeroesStore";
import hero_data from "@/lib/features/heroes/hero_data";
import WrapHero from "@/components/Heros/WrapHero";
import SoldiersWave from "@/components/soldiers/SoldiersWave";
import { useSoldiersStore } from "@/lib/features/soldiers/useSoldiersStore";

export default function Home() {
    const { scale } = useSelector((state: RootState) => state.aov.settings);
    const [nak, mur] = hero_data;
    const {
        heroes,
        heroIds,
        addHero,
        moveHeroSmoothly,
        updateHeroPositions
    } = useHeroesStore();

    const {
        updateSoldierPositions,
    } = useSoldiersStore();

    const [time, setTime] = useState(0);
    const selectedHero = 'hero-1';
    const mapWrapperRef = useRef<HTMLDivElement>(null);
    const lastTimeRef = useRef<number>(0);

    // Initialize heroes once
    useEffect(() => {
        if (heroIds.length === 0) {
            addHero(nak);
            addHero(mur);
        }
    }, [addHero, heroIds.length]);

    // Animation loop: update time and update hero/soldier positions
    useEffect(() => {
        let animationId: number;

        const tick = (now: number) => {
            const delta = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;
            setTime(prev => prev + delta);
            updateHeroPositions();
            updateSoldierPositions();
            animationId = requestAnimationFrame(tick);
        };

        animationId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationId);
    }, [updateHeroPositions, updateSoldierPositions]);

    // Handle map click - smooth move selected hero
    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedHero || !mapWrapperRef.current) return;

        const rect = mapWrapperRef.current.getBoundingClientRect();
        const target = {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale
        };

        const hero = heroes[selectedHero];
        if (!hero) return;

        moveHeroSmoothly(selectedHero, target, hero.speed);
    };

    return (
        <>
            <AOVSettingsDropdown />
            <div
                ref={mapWrapperRef}
                onClick={handleMapClick}
                style={{ cursor: selectedHero ? 'crosshair' : 'default' }}
            >
                <MapWrapper scale={scale}>
                    {/* Render Heroes */}
                    {heroIds.map((heroId) => {
                        const hero = heroes[heroId];
                        return (
                            <WrapHero key={heroId} hero={hero}>
                                <SvgPlayer
                                    HeroComponent={hero.renderElement}
                                    duration={0}
                                    timings={hero.timings ?? {}}
                                />
                                <div className="text-white text-xs bg-black bg-opacity-50 p-1 rounded">
                                    {hero.name} (Lv.{hero.level}) HP: {hero.hp}/{hero.maxHp}
                                </div>
                            </WrapHero>
                        );
                    })}
                    <Terrain />
                    <SoldiersWave />
                </MapWrapper>
            </div>
        </>
    );
}

