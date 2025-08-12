// types/unitTypes.ts
export type UnitType = 'soldier' | 'hero' | 'building';

export interface Position {
    x: number;
    y: number;
}

export interface UnitBase {
    id: string;
    type: UnitType;
    name: string;
    hp: number;
    maxHp: number;
    position: Position;
    team: 'ally' | 'enemy';
    level?: number;
}

export interface Soldier extends UnitBase {
    type: 'soldier';
    attackDamage: number;
}

export interface Hero extends UnitBase {
    type: 'hero';
    abilities: string[];
    mana: number;
    maxMana: number;
}

export type Unit = Soldier | Hero;

export interface UnitsState {
    units: Record<string, Unit>; // ID -> Unit mapping
    unitIds: string[]; // Array of all unit IDs
}
