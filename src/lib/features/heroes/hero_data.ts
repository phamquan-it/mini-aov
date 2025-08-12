import { muradTimings, nakrothTimmings } from "@/constants/animateTime";
import { Hero } from "./Hero";
import { NakSVGInline } from "@/heros/Nakroth";
import { MuradSVGInline } from "@/heros/murad";

const hero_data:Hero[] = [
     {
         id: 'hero-1',
         name: 'Nakroth',
         hp: 100,
         maxHp: 100,
         position: { x: 672, y: 2714 },
         level: 1,
         mana: 50,
         maxMana: 50,
         abilities: ['dash', 'slash'],
         team: 'ally',
         timings: nakrothTimmings,
         speed: 300 // Slower speed for smooth movement
         ,
         renderElement: NakSVGInline
     },
    {
        id: 'hero-2',
        name: 'Murad',
        hp: 120,
        maxHp: 120,
        position: { x: 6312, y: 300 },
        level: 1,
        mana: 40,
        maxMana: 40,
        abilities: ['teleport', 'strike'],
        team: 'enemy',
        timings: muradTimings,
        speed: 300 // Even slower speed
        ,
        renderElement: MuradSVGInline
    }

]
export default hero_data
