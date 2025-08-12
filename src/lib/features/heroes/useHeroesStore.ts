
// features/heroes/useHeroesStore.ts
/**
 * Heroes Store - Zustand Implementation
 * 
 * This store manages the state of heroes in the application, including:
 * - Hero creation/removal
 * - Position tracking
 * - Health and mana management
 * - Level progression
 * - Ability usage
 * 
 * The store follows an entity-component pattern where heroes are stored in a Record
 * (object) with their IDs as keys, and an additional array tracks all hero IDs
 * for easy iteration.
 * 
 * Key Features:
 * - Type-safe state management using TypeScript interfaces
 * - Immutable state updates via Zustand's set function
 * - Comprehensive hero management operations
 * - Support for both ally and enemy heroes
 * 
 * Usage:
 * Import and use the hook in components: const { heroes, addHero } = useHeroesStore();
 * 
 * State Structure:
 * {
 *   heroes: { [id: string]: Hero },  // Dictionary of all heroes by ID
 *   heroIds: string[],               // Array of all hero IDs for iteration
 *   ...actionFunctions              // All hero management functions
 * }
 */
import { create } from 'zustand';
import { HeroesState } from './HeroesState';
import { Hero } from './Hero';
import { positionAtTime } from '@/utils';

const useHeroesStore = create<HeroesState>((set, get) => ({
    heroes: {},
    heroIds: [],
    updateHero: (id, updates) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    ...updates
                }
            }
        };
    }),

    addHero: (hero) => set((state) => ({
        heroes: { ...state.heroes, [hero.id]: hero },
        heroIds: [...state.heroIds, hero.id]
    })),

    removeHero: (id) => set((state) => {
        const { [id]: _, ...remainingHeroes } = state.heroes;
        return {
            heroes: remainingHeroes,
            heroIds: state.heroIds.filter(heroId => heroId !== id)
        };
    }),

    moveHero: (id, position) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    position
                }
            }
        };
    }),

    damageHero: (id, amount) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        const newHp = Math.max(hero.hp - amount, 0);

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    hp: newHp
                }
            }
        };
    }),

    healHero: (id, amount) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    hp: Math.min(hero.hp + amount, hero.maxHp)
                }
            }
        };
    }),

    levelUpHero: (id) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    level: hero.level + 1,
                    maxHp: hero.maxHp + 10,
                    hp: hero.maxHp + 10,
                    maxMana: hero.maxMana + 5,
                    mana: hero.maxMana + 5
                }
            }
        };
    }),

    useHeroAbility: (id, ability, manaCost) => set((state) => {
        const hero = state.heroes[id];
        if (!hero || hero.mana < manaCost) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    mana: hero.mana - manaCost
                }
            }
        };
    }),
    moveHeroSmoothly: (id, target, speed = 200) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    movement: {
                        start: hero.position,
                        end: target,
                        startTime: Date.now(),
                        speed
                    }
                }
            }
        };
    }),

    updateHeroPositions: () => set((state) => {
        const now = Date.now();
        const updates: Record<string, Hero> = {};
        const precision = 0.1; // Ngưỡng sai số cho vị trí cuối

        for (const [id, hero] of Object.entries(state.heroes)) {
            if (hero.movement) {
                const { start, end, startTime, speed } = hero.movement;
                const t = (now - startTime) / 1000;

                const newPos = positionAtTime(start, end, speed, t);

                // So sánh với ngưỡng sai số thay vì so sánh chính xác
                const isComplete =
                    Math.abs(newPos.x - end.x) < precision &&
                    Math.abs(newPos.y - end.y) < precision;

                if (isComplete) {
                    // skip for emprove frame client
                   // updates[id] = {
                   //     ...hero,
                   //     position: end,
                   //     movement: undefined
                   // };
                } else {
                    updates[id] = {
                        ...hero,
                        position: newPos
                    };
                }
            }
        }

        return { heroes: { ...state.heroes, ...updates } };
    }),

    restoreMana: (id, amount) => set((state) => {
        const hero = state.heroes[id];
        if (!hero) return state;

        return {
            heroes: {
                ...state.heroes,
                [id]: {
                    ...hero,
                    mana: Math.min(hero.mana + amount, hero.maxMana)
                }
            }
        };
    })
}));

export default useHeroesStore;
