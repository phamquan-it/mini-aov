import { useEffect, useRef, useState } from "react";
//import type { SkillTimings } from "./types";

interface UseAnimationControllerProps {
    duration: number;
    timings: any;
    initialActiveSkill?: string | null;
    frameIntervalMs?: number;
    timeStep?: number;
}

export function useAnimationController({
    duration,
    timings,
    initialActiveSkill = "move",
    frameIntervalMs = 33,
    timeStep = 0.032,
}: UseAnimationControllerProps) {
    const [time, setTime] = useState(0);
    const [activeSkill, setActiveSkill] = useState<string | null>(initialActiveSkill);
    const [isPlaying, setIsPlaying] = useState(true);

    const animationRef = useRef<number>(0);
    const lastTimestampRef = useRef<number>(0);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!lastTimestampRef.current || timestamp - lastTimestampRef.current >= frameIntervalMs) {
                setTime((prev) => {
                    let nextTime = prev + timeStep;

                    if (activeSkill && timings[activeSkill]) {
                        const range = timings[activeSkill]!;

                        if (activeSkill === "move" && nextTime >= range.endTime) {
                            nextTime = range.startTime;
                        }

                        if (activeSkill !== "move" && nextTime >= range.endTime) {
                            nextTime = timings.move?.startTime || 0;
                            setActiveSkill("move");
                        }
                    } else {
                        if (nextTime >= duration) nextTime = 0;
                    }

                    lastTimestampRef.current = timestamp;
                    return nextTime;
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, activeSkill, timings, duration, frameIntervalMs, timeStep]);

    return { time, activeSkill, setActiveSkill, isPlaying, setIsPlaying };
}

