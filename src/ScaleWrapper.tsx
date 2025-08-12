"use client";
import { useEffect, useRef, useState } from 'react';

interface ScaleWrapperProps {
    children: React.ReactNode;
    originalWidth: number;
    originalHeight: number;
    padding?: number;
    maxScale?: number;
    minScale?: number;
}

const ScaleWrapper = ({
    children,
    originalWidth,
    originalHeight,
    padding = 0.1,
    maxScale = 1,
    minScale = 1
}: ScaleWrapperProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(3);

    const calculateScale = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const widthScale = (containerWidth * (1 - padding)) / originalWidth;
        const heightScale = (containerHeight * (1 - padding)) / originalHeight;

        const newScale = Math.min(widthScale, heightScale);
        const clampedScale = Math.min(maxScale, Math.max(minScale, newScale));

        setScale(clampedScale);
    };

    useEffect(() => {
        calculateScale();
        window.addEventListener('resize', calculateScale);

        return () => {
            window.removeEventListener('resize', calculateScale);
        };
    }, [originalWidth, originalHeight, padding]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${originalWidth}px`,
                    height: `${originalHeight}px`,
                    willChange: 'transform'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScaleWrapper;
