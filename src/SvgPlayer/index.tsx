import React, { useRef } from "react";
import DebugSkillPanel from "./DebugSkillPanel";
import SvgDisplay from "./SvgDisplay";
import { useAnimationController } from "./useAnimationController";
import { useSkillKeyboardControls } from "./useSkillKeyboardControls";
import { SkillTimings } from "./types";
interface SvgPlayerProps {
    HeroComponent: React.ForwardRefExoticComponent<
        React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
    >;
    duration: number;
    timings: SkillTimings;
    width?: number | string;
    height?: number | string;
    isMoving?: boolean;
}

const SvgPlayer: React.FC<SvgPlayerProps> = ({
    HeroComponent,
    duration,
    timings,
    width = 500,
    height = 900,
    isMoving = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Animation controller hook
    const { time, activeSkill, setActiveSkill, isPlaying, setIsPlaying } =
        useAnimationController({
            duration,
            timings,
            initialActiveSkill: "move",
            frameIntervalMs: 33,
            timeStep: 0.032,
        });

    // Seek handler
    const handleSeek = (newTime: number) => {
        const svg = svgRef.current;
        if (svg?.setCurrentTime) {
            svg.setCurrentTime(newTime);
        }
    };

    // Keyboard controls hook
    useSkillKeyboardControls(
        containerRef,
        timings,
        setActiveSkill,
        (t) => {
            handleSeek(t);
        },
        setIsPlaying
    );

    // Toggle play/pause
    const togglePlay = () => {
        const svg = svgRef.current;
        if (!svg) return;

        if (isPlaying) {
            svg.pauseAnimations?.();
            setIsPlaying(false);
        } else {
            svg.unpauseAnimations?.();
            setIsPlaying(true);
        }
    };

    // Click skill button handler
    const onSkillClick = (skill: string) => {
        const range = timings[skill as keyof SkillTimings];
        if (!range) return;
        setActiveSkill(skill);
        handleSeek(range.startTime);
        setIsPlaying(true);
    };

    // Check if skill is active
    const isSkillActive = (skill: string) => {
        const range = timings[skill as keyof SkillTimings];
        if (!range) return false;
        return time >= range.startTime && time <= range.endTime;
    };

    return (
        <div
            ref={containerRef}
            style={{
                width,
                height,
                position: "relative",
                outline: "none",
            }}
            tabIndex={0}
        >
            <SvgDisplay HeroComponent={HeroComponent} ref={svgRef} isMoving={isMoving} />

            <DebugSkillPanel
                time={time}
                duration={duration}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                handleSeek={(t) => {
                    handleSeek(t);
                }}
                timings={timings}
                activeSkill={activeSkill}
                onSkillClick={onSkillClick}
                isSkillActive={isSkillActive}
            />
        </div>
    );
};

export default SvgPlayer;

