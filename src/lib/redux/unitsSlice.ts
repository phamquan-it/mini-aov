import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Position {
    x: number;
    y: number;
}

interface Buff {
    id: string;
    name: string;
    duration: number;
}

interface Unit {
    id: string;
    type: string;
    hp: number;
    maxHp: number;
    position: Position;
    status: "idle" | "moving" | "attacking" | "dead";
    ownerId: string;
    level: number;
    buffs: Buff[];
}

interface UnitsState {
    byId: Record<string, Unit>;
    allIds: string[];
}

const initialState: UnitsState = {
    byId: {},
    allIds: [],
};

const unitsSlice = createSlice({
    name: "units",
    initialState,
    reducers: {
        addUnit: (state, action: PayloadAction<Unit>) => {
            const unit = action.payload;
            state.byId[unit.id] = unit;
            if (!state.allIds.includes(unit.id)) {
                state.allIds.push(unit.id);
            }
        },
        updateUnitPosition: (
            state,
            action: PayloadAction<{ id: string; position: Position }>
        ) => {
            const { id, position } = action.payload;
            if (state.byId[id]) {
                state.byId[id].position = position;
            }
        },
        updateUnitStatus: (
            state,
            action: PayloadAction<{ id: string; status: Unit["status"] }>
        ) => {
            const { id, status } = action.payload;
            if (state.byId[id]) {
                state.byId[id].status = status;
            }
        },
        damageUnit: (
            state,
            action: PayloadAction<{ id: string; damage: number }>
        ) => {
            const { id, damage } = action.payload;
            if (state.byId[id]) {
                const unit = state.byId[id];
                unit.hp = Math.max(unit.hp - damage, 0);
                if (unit.hp === 0) {
                    unit.status = "dead";
                }
            }
        },
        removeUnit: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            delete state.byId[id];
            state.allIds = state.allIds.filter((unitId) => unitId !== id);
        },
        addBuffToUnit: (
            state,
            action: PayloadAction<{ id: string; buff: Buff }>
        ) => {
            const { id, buff } = action.payload;
            if (state.byId[id]) {
                state.byId[id].buffs.push(buff);
            }
        },
        removeBuffFromUnit: (
            state,
            action: PayloadAction<{ id: string; buffId: string }>
        ) => {
            const { id, buffId } = action.payload;
            if (state.byId[id]) {
                state.byId[id].buffs = state.byId[id].buffs.filter((b) => b.id !== buffId);
            }
        },
        levelUpUnit: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            if (state.byId[id]) {
                state.byId[id].level += 1;
                // Optional: tăng maxHp hoặc stats khác khi lên cấp
                state.byId[id].maxHp += 10;
                state.byId[id].hp = state.byId[id].maxHp;
            }
        },
    },
});

export const {
    addUnit,
    updateUnitPosition,
    updateUnitStatus,
    damageUnit,
    removeUnit,
    addBuffToUnit,
    removeBuffFromUnit,
    levelUpUnit,
} = unitsSlice.actions;

export default unitsSlice.reducer;

