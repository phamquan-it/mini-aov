// /lib/features/soldiers/useSoldiersStore.ts
"use client";
import { create } from "zustand";
import { Point } from "@/types";
import { nanoid } from "nanoid";
import { positionAtTime } from "@/utils";
import { endPos, startPos } from "@/constants";

export interface Soldier {
    id: string;
    position: Point;
    speed: number; // units/second
    movement: {
        start: Point;
        end: Point;
        speed: number;
        startTime: number; // ms từ performance.now()
    };
}

interface SoldiersState {
    soldiers: Record<string, Soldier>;
    soldierIds: string[];
    waveNumber: number;
    isSpawning: boolean;
    startAutoSpawn: () => void;
    spawnWave: () => void;
    updateSoldierPositions: () => void;
}

export const useSoldiersStore = create<SoldiersState>((set, get) => {
    let animationFrameId: number;

    const updateLoop = () => {
        get().updateSoldierPositions();
        animationFrameId = requestAnimationFrame(updateLoop);
    };

    return {
        soldiers: {},
        soldierIds: [],
        waveNumber: 0,
        isSpawning: false,

        startAutoSpawn: () => {
            if (get().isSpawning) return;
            set({ isSpawning: true });
            get().spawnWave();
            updateLoop();
        },

        spawnWave: () => {
            const waveSize = 5; // số lính mỗi đợt
            const spawnInterval = 2000; // ms giữa 2 lính
            const startBase: Point = startPos;
            const endPoint: Point = endPos;

            const spawnOne = (i: number) => {
                const id = nanoid();
                const speed = 50; // units/sec
                const now = performance.now();

                set(state => ({
                    soldiers: {
                        ...state.soldiers,
                        [id]: {
                            id,
                            position: startBase,
                            speed,
                            movement: {
                                start: startBase,
                                end: endPoint,
                                speed,
                                startTime: now
                            }
                        }
                    },
                    soldierIds: [...state.soldierIds, id]
                }));
            };

            for (let i = 0; i < waveSize; i++) {
                setTimeout(() => {
                    spawnOne(i);
                    if (i === waveSize - 1) {
                        // Sau khi xong wave này, 5s sau spawn wave tiếp
                        setTimeout(() => {
                            set(state => ({ waveNumber: state.waveNumber + 1 }));
                            get().spawnWave();
                        }, 90000);
                    }
                }, i * spawnInterval);
            }
        },

        updateSoldierPositions: () => {
            const now = performance.now();
            set(state => {
                const updated: Record<string, Soldier> = {};
                for (const id of state.soldierIds) {
                    const s = state.soldiers[id];
                    if (!s.movement) continue;

                    const elapsed = (now - s.movement.startTime) / 1000; // giây
                    const newPos = positionAtTime(
                        s.movement.start,
                        s.movement.end,
                        s.movement.speed,
                        elapsed
                    );

                    updated[id] = { ...s, position: newPos };
                }
                return { soldiers: { ...state.soldiers, ...updated } };
            });
        }
    };
});

