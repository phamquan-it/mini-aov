import { ReactNode } from "react";
import { Position } from "./Position";

export interface Hero {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    position: Position;
    level: number;
    mana: number;
    renderElement: any;
    maxMana: number;
    abilities: string[];
    team: 'ally' | 'enemy';
    timings?: any,
    movement?: {
        start: Position;
        end: Position;
        startTime: number;
        speed: number;
    };
    speed: number
}

