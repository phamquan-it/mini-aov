import { useEffect, useRef, useState } from "react";

type SkillTimings = Record<
    string,
    { startTime: number; endTime: number }
>;

interface UseAnimationTimerProps {
    duration: number;
    timings: SkillTimings;
    isPlaying: boolean;
    activeSkill: string | null;
    onActiveSkillChange: (skill: string) => void;
    frameIntervalMs?: number; // default 33ms ~30fps
    timeStep?: number; //  defaut 0.032
}

export function useAnimationTimer({
    duration,
    timings,
    isPlaying,
    activeSkill,
    onActiveSkillChange,
    frameIntervalMs = 33,
    timeStep = 0.032,
}: UseAnimationTimerProps) {
    const [time, setTime] = useState(0);
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
                            onActiveSkillChange("move");
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
    }, [isPlaying, activeSkill, timings, duration, onActiveSkillChange, frameIntervalMs, timeStep]);

    return { time };
}

