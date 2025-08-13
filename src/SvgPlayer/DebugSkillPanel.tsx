import React from 'react';
import { TimeRange } from '.';

interface DebugSkillPanelProps {
  time: number;
  duration: number;
  isPlaying: boolean;
  togglePlay: () => void;
  handleSeek: (newTime: number) => void;
  timings: Record<string, TimeRange>;
  activeSkill: string | null;
  onSkillClick: (skill: string) => void;
  isSkillActive: (skill: string) => boolean;
}

export default function DebugSkillPanel({
  time,
  duration,
  isPlaying,
  togglePlay,
  handleSeek,
  timings,
  activeSkill,
  onSkillClick,
  isSkillActive,
}: DebugSkillPanelProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <button onClick={togglePlay} style={{ marginRight: 10 }}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={time}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          style={{ flex: 1, marginRight: 10 }}
        />
        <span>
          {time.toFixed(2)}s / {duration.toFixed(2)}s
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(timings).map(([skill]) => (
          <button
            key={skill}
            onClick={() => onSkillClick(skill)}
            style={{
              padding: '6px 12px',
              backgroundColor: activeSkill === skill ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              opacity: isSkillActive(skill) ? 1 : 0.7,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {skill.toUpperCase()}{' '}
            {skill === 'attack' ? '(ENTER)' : skill === 'skill3' ? '(R)' : skill === 'skill1' ? '(Q)' : skill === 'skill2' ? '(W)' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

