import React, { useEffect, useRef, useState, useCallback } from "react";

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
    isMoving?: boolean;
}

const SvgPlayer: React.FC<SvgPlayerProps> = ({
    HeroComponent,
    duration,
    timings,
    width = 500,
    height = 900,
    isMoving = true
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeSkill, setActiveSkill] = useState<string | null>(null);
    const animationRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-select move animation when component mounts or timings change
    useEffect(() => {
        if (timings.move) {
            setActiveSkill('move');
            setIsPlaying(true);
        }
    }, [timings.move]);

    // Handle Enter key press for attack animation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
            case 'enter':
                if (timings.attack) {
                    e.preventDefault();
                    setActiveSkill('attack');
                    handleSeek(timings.attack.startTime);
                    setIsPlaying(true);
                }
                break;
            case 'q':
                if (timings.skill1) {
                    e.preventDefault();
                    setActiveSkill('skill1');
                    handleSeek(timings.skill1.startTime);
                    setIsPlaying(true);
                }
                break;
            case 'w':
                if (timings.skill2) {
                    e.preventDefault();
                    setActiveSkill('skill2');
                    handleSeek(timings.skill2.startTime);
                    setIsPlaying(true);
                }
                break;
            case 'r':
                if (timings.skill3) {
                    e.preventDefault();
                    setActiveSkill('skill3');
                    handleSeek(timings.skill3.startTime);
                    setIsPlaying(true);
                }
                break;
            // You can add more keys here if needed
            default:
                break;
        }

    }, [timings.attack]);

    // Set up keyboard event listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('keydown', handleKeyDown);
        return () => {
            container.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Handle animation loop
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const animate = (timestamp: number) => {
            setTime(prev => {
                let nextTime = prev + 0.016; // ~60fps

                if (activeSkill && timings[activeSkill as keyof SkillTimings]) {
                    const range = timings[activeSkill as keyof SkillTimings]!;

                    // Loop move animation continuously
                    if (activeSkill === 'move' && nextTime >= range.endTime) {
                        nextTime = range.startTime;
                    }

                    // For other skills (like attack), return to move animation after completion
                    if (activeSkill !== 'move' && nextTime >= range.endTime) {
                        nextTime = timings.move?.startTime || 0;
                        setActiveSkill('move');
                    }

                    svg.setCurrentTime?.(nextTime);
                } else {
                    // Default timeline behavior
                    if (nextTime >= duration) nextTime = 0;
                    svg.setCurrentTime?.(nextTime);
                }

                return nextTime;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, activeSkill, timings, duration]);

    // Reset animations when HeroComponent changes
    useEffect(() => {
        const svg = svgRef.current;
        if (svg?.pauseAnimations) {
            svg.pauseAnimations();
            svg.setCurrentTime?.(0);
        }
        setTime(0);
        setActiveSkill(null);
        setIsPlaying(true);
    }, [HeroComponent]);

    const togglePlay = () => {
        const svg = svgRef.current;
        if (!svg) return;

        if (isPlaying) {
            svg.pauseAnimations();
            setIsPlaying(false);
        } else {
            svg.unpauseAnimations();
            setIsPlaying(true);
        }
    };

    const handleSeek = (newTime: number) => {
        const svg = svgRef.current;
        if (svg?.setCurrentTime) {
            svg.setCurrentTime(newTime);
            setTime(newTime);
        }
    };

    const onSkillClick = (skill: string) => {
        const range = timings[skill as keyof SkillTimings];
        if (!range) return;

        setActiveSkill(skill);
        handleSeek(range.startTime);
        setIsPlaying(true);
    };

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
                position: 'relative',
                outline: 'none'
            }}
            tabIndex={0} // Make the container focusable
        >
            <HeroComponent
                ref={svgRef}
                style={{
                    transform: isMoving ? 'scaleX(-1)' : 'none',
                    transition: 'transform 0.2s ease'
                }}
            />

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button onClick={togglePlay} style={{ marginRight: '10px' }}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.01}
                        value={time}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        style={{ flex: 1, marginRight: '10px' }}
                    />
                    <span>{time.toFixed(2)}s / {duration.toFixed(2)}s</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(timings).map(([skill, range]) => (
                        <button
                            key={skill}
                            onClick={() => onSkillClick(skill)}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: activeSkill === skill ? '#4CAF50' : '#555',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                opacity: isSkillActive(skill) ? 1 : 0.7,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {skill.toUpperCase()} {skill === 'attack' && '(ENTER)'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SvgPlayer;
