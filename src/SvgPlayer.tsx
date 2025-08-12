import React, { useEffect, useRef, useState } from "react";

type TimeRange = { startTime: number; endTime: number };
type SkillTimings = {
    move?: TimeRange;
    attack?: TimeRange;
    skill1?: TimeRange;
    skill2?: TimeRange;
    skill3?: TimeRange;
};

interface SvgPlayerProps {
    HeroComponent: React.ForwardRefExoticComponent<
        React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
    >;
    duration: number;
    timings: SkillTimings;
    width?: number | string;
    height?: number | string;
    isMoving?: any
}

const SvgPlayer: React.FC<SvgPlayerProps> = ({
    HeroComponent,
    duration,
    timings,
    width = 500,
    height = 900,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Skill đang được chơi
    const [activeSkill, setActiveSkill] = useState<string | null>(null);

    // Reset và pause animation khi đổi HeroComponent
    useEffect(() => {
        const svg = svgRef.current;
        if (svg && svg.pauseAnimations) {
            svg.pauseAnimations();
            if (svg.setCurrentTime) svg.setCurrentTime(0);
        }
        setTime(0);
        setActiveSkill(null);
        setIsPlaying(false);
    }, [HeroComponent]);

    // Play/pause toggle
    const togglePlay = () => {
        const svg = svgRef.current;
        if (!svg) return;

        if (isPlaying) {
            svg.pauseAnimations();
            setIsPlaying(false);
            setActiveSkill(null);
        } else {
            svg.unpauseAnimations();
            setIsPlaying(true);
        }
    };

    // Set thời gian mới (seek)
    const handleSeek = (newTime: number) => {
        const svg = svgRef.current;
        if (svg && svg.setCurrentTime) {
            svg.setCurrentTime(newTime);
            setTime(newTime);
        }
    };

    // Tăng thời gian khi đang play, dừng khi hết skill hoặc duration
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setTime((prev) => {
                let next = prev + 0.05;
                const svg = svgRef.current;

                if (activeSkill) {
                    const range = timings[activeSkill as keyof SkillTimings];
                    if (!range) return prev;

                    if (next >= range.endTime) {
                        next = range.endTime;
                        if (svg && svg.pauseAnimations) svg.pauseAnimations();
                        setIsPlaying(false);
                        setActiveSkill(null);
                        clearInterval(interval);
                    } else {
                        if (svg && svg.setCurrentTime) svg.setCurrentTime(next);
                    }
                } else {
                    if (next >= duration) {
                        next = duration;
                        if (svg && svg.pauseAnimations) svg.pauseAnimations();
                        setIsPlaying(false);
                        clearInterval(interval);
                    } else {
                        if (svg && svg.setCurrentTime) svg.setCurrentTime(next);
                    }
                }
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isPlaying, activeSkill, timings, duration]);

    // Khi click skill, set activeSkill, đặt time về startTime và play
    const onSkillClick = (skill: string) => {
        const range = timings[skill as keyof SkillTimings];
        if (!range) return;

        setActiveSkill(skill);
        handleSeek(range.startTime);

        if (!isPlaying) {
            const svg = svgRef.current;
            if (svg && svg.unpauseAnimations) svg.unpauseAnimations();
            setIsPlaying(true);
        }
    };

    // Kiểm tra skill active tại thời điểm time hiện tại
    const isSkillActive = (skill: string) => {
        const range = timings[skill as keyof SkillTimings];
        if (!range) return false;
        return time >= range.startTime && time <= range.endTime;
    };

    return (
        <div style={{ width, height }}>
            {/* Hero SVG */}
            <HeroComponent ref={svgRef} />

            <div style={{ marginTop: 10 }}>
                <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={time}
                    onChange={(e) => {
                        handleSeek(parseFloat(e.target.value));
                        setActiveSkill(null);
                        setIsPlaying(false);
                    }}
                    style={{ width: 300, margin: "0 10px" }}
                />
                <span>{time.toFixed(2)}s</span>
            </div>

            <div style={{ marginTop: 20 }}>
                <strong>Skills:</strong>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {Object.entries(timings).map(([skill, range]) => (
                        <button
                            key={skill}
                            onClick={() => onSkillClick(skill)}
                            style={{
                                padding: "6px 12px",
                                cursor: "pointer",
                                backgroundColor: activeSkill === skill ? "green" : "gray",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                opacity: isSkillActive(skill) ? 1 : 0.6,
                            }}
                            title={`${skill} (${range.startTime}s - ${range.endTime}s)`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SvgPlayer;

