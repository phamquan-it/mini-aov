import { Position } from "@/types";

export interface Soldier {
    id: string;                  // Unique identifier
    type: 'melee' | 'ranged' | 'siege';  // Minion type (melee, ranged, siege)
    hp: number;                  // Current health points
    maxHp: number;               // Max health points
    position: Position;          // Current map position
    speed: number;               // Movement speed
    attackDamage: number;        // Base attack damage
    attackRange: number;         // Attack range (melee usually small, ranged larger)
    attackSpeed: number;         // Attack interval (attacks per second or cooldown)
    armor: number;               // Physical defense stat
    magicResist: number;         // Magic defense stat
    team: 'ally' | 'enemy';     // Team alignment
    movement?: {
        start: Position;
        end: Position;
        startTime: number;
        speed: number;
    };
    targetId?: string | null;    // Current target (enemy unit id)
    isAlive: boolean;            // Is this soldier alive
}

