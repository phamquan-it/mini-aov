"use client";
import React, { ReactNode } from "react";
import Terrain from "@/maps/terrain";
import { MAP_ORIGINAL_HEIGHT, MAP_ORIGINAL_WIDTH } from "./constants";

interface MapWrapperProps {
    scale: number;
    children: ReactNode;
}

export default function MapWrapper({ scale, children }: MapWrapperProps) {
    const scaledWidth = MAP_ORIGINAL_WIDTH * scale;
    const scaledHeight = MAP_ORIGINAL_HEIGHT * scale;

    return (
        <div
            style={{
                width: scaledWidth,
                height: scaledHeight,
                border: "1px solid #ccc",
                position: "relative",
            }}
        >
            <div
                style={{
                    width: MAP_ORIGINAL_WIDTH,
                    height: MAP_ORIGINAL_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / scale;
                    const y = (e.clientY - rect.top) / scale;
                    console.log("Click position in map coordinates:", x, y);
                }}
            > 
                {children}
            </div>
        </div>
    );
}

