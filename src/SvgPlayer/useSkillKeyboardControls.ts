import { useEffect, useCallback } from "react";

type SkillTimings = Record<string, { startTime: number; endTime: number }>;

export function useSkillKeyboardControls(
    containerRef: React.RefObject<HTMLDivElement | null>,
    timings: SkillTimings,
    setActiveSkill: (skill: string) => void,
    handleSeek: (time: number) => void,
    setIsPlaying: (flag: boolean) => void
) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key.toLowerCase()) {
                case "enter":
                    if (timings.attack) {
                        e.preventDefault();
                        setActiveSkill("attack");
                        handleSeek(timings.attack.startTime);
                        setIsPlaying(true);
                    }
                    break;
                case "q":
                    if (timings.skill1) {
                        e.preventDefault();
                        setActiveSkill("skill1");
                        handleSeek(timings.skill1.startTime);
                        setIsPlaying(true);
                    }
                    break;
                case "w":
                    if (timings.skill2) {
                        e.preventDefault();
                        setActiveSkill("skill2");
                        handleSeek(timings.skill2.startTime);
                        setIsPlaying(true);
                    }
                    break;
                case "r":
                    if (timings.skill3) {
                        e.preventDefault();
                        setActiveSkill("skill3");
                        handleSeek(timings.skill3.startTime);
                        setIsPlaying(true);
                    }
                    break;
            }
        },
        [timings, setActiveSkill, handleSeek, setIsPlaying]
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("keydown", handleKeyDown);
        return () => container.removeEventListener("keydown", handleKeyDown);
    }, [containerRef, handleKeyDown]);
}

