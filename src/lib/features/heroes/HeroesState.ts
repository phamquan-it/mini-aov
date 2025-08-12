import { Hero } from "./Hero";
import { Position } from "./Position";

export interface HeroesState {
    heroes: Record<string, Hero>;
    heroIds: string[];
    addHero: (hero: Hero) => void;
    removeHero: (id: string) => void;
    moveHero: (id: string, position: Position) => void;
    damageHero: (id: string, amount: number) => void;
    healHero: (id: string, amount: number) => void;
    levelUpHero: (id: string) => void;
    useHeroAbility: (id: string, ability: string, manaCost: number) => void;
    restoreMana: (id: string, amount: number) => void;
    updateHero: (id: string, updates: Partial<Omit<Hero, 'id'>>) => void;
    moveHeroSmoothly: (
        id: string,
        target: Position,
        speed?: number
    ) => void,
    updateHeroPositions: () => void; // updates all moving heroes
}


