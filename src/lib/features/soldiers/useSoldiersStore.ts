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
    speed: number;
    movement: {
        start: Point;
        end: Point;
        speed: number;
        startTime: number;
    };
    team: 'ally' | 'enemy';
    isAttacking: boolean; // Thêm trạng thái tấn công
    targetId?: string; // ID của mục tiêu đang tấn công
}

interface SoldiersState {
    soldiers: Record<string, Soldier>;
    soldierIds: string[];
    waveNumber: number;
    isSpawning: boolean;
    startAutoSpawn: () => void;
    spawnWave: (team: 'ally' | 'enemy') => void;
    updateSoldierPositions: () => void;
    findNearestEnemy: (soldier: Soldier) => Soldier | null;
}

export const useSoldiersStore = create<SoldiersState>((set, get) => {
    let animationFrameId: number;

    const updateLoop = () => {
        get().updateSoldierPositions();
        animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Hàm tìm kẻ địch gần nhất
    const findNearestEnemy = (soldier: Soldier): Soldier | null => {
        const { soldiers, soldierIds } = get();
        let nearestEnemy: Soldier | null = null;
        let minDistance = Infinity;

        for (const id of soldierIds) {
            const potentialEnemy = soldiers[id];
            if (potentialEnemy.team === soldier.team) continue;

            const distance = Math.sqrt(
                Math.pow(soldier.position.x - potentialEnemy.position.x, 2) + 
                Math.pow(soldier.position.y - potentialEnemy.position.y, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = potentialEnemy;
            }
        }

        return minDistance <= 100 ? nearestEnemy : null;
    };

    return {
        soldiers: {},
        soldierIds: [],
        waveNumber: 0,
        isSpawning: false,
        findNearestEnemy,

        startAutoSpawn: () => {
            if (get().isSpawning) return;
            set({ isSpawning: true });
            get().spawnWave('ally');
            get().spawnWave('enemy');
            updateLoop();
        },

        spawnWave: (team: 'ally' | 'enemy') => {
            const waveSize = 5;
            const spawnInterval = 2000;
            const startBase = team === 'ally' ? startPos : endPos;
            const endPoint = team === 'ally' ? endPos : startPos;

            const spawnOne = (i: number) => {
                const id = nanoid();
                const speed = 50;
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
                            },
                            team,
                            isAttacking: false
                        }
                    },
                    soldierIds: [...state.soldierIds, id]
                }));
            };

            for (let i = 0; i < waveSize; i++) {
                setTimeout(() => {
                    spawnOne(i);
                    if (i === waveSize - 1) {
                        setTimeout(() => {
                            set(state => ({ waveNumber: state.waveNumber + 1 }));
                            get().spawnWave(team);
                        }, 90000);
                    }
                }, i * spawnInterval);
            }
        },

        updateSoldierPositions: () => {
            const now = performance.now();
            set(state => {
                const updated: Record<string, Soldier> = {};
                const { soldiers, soldierIds } = state;

                for (const id of soldierIds) {
                    const s = soldiers[id];
                    if (!s.movement) continue;

                    const nearestEnemy = get().findNearestEnemy(s);
                    let newPosition = s.position;
                    let isAttacking = false;
                    let targetId = undefined;

                    if (nearestEnemy) {
                        isAttacking = true;
                        targetId = nearestEnemy.id;
                    } else {
                        const elapsed = (now - s.movement.startTime) / 1000;
                        newPosition = positionAtTime(
                            s.movement.start,
                            s.movement.end,
                            s.movement.speed,
                            elapsed
                        );
                    }

                    updated[id] = { 
                        ...s, 
                        position: newPosition,
                        isAttacking,
                        targetId
                    };
                }

                return { soldiers: { ...state.soldiers, ...updated } };
            });
        }
    };
});
