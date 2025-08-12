// features/aov/aovSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AOVSettings } from './aovTypes';

interface AOVState {
    settings: AOVSettings;
}
const initialState: AOVState = {
    settings: {
        scale: 0.2,
        minScale: 0.1,
        maxScale: 2.0,
        fov: 60, // Default field of view
        zoom: 1.0 // Default zoom level
    }
};

const aovSlice = createSlice({
    name: 'aov',
    initialState,
    reducers: {
        // Set the scale value
        setScale: (state, action: PayloadAction<number>) => {
            state.settings.scale = Math.max(
                Math.min(action.payload, state.settings.maxScale || 2.0),
                state.settings.minScale || 0.1
            );
        },

        // Set the field of view
        setFOV: (state, action: PayloadAction<number>) => {
            state.settings.fov = action.payload;
        },

        // Set the zoom level
        setZoom: (state, action: PayloadAction<number>) => {
            state.settings.zoom = action.payload;
        },

        // Reset all AOV settings to defaults
        resetAOVSettings: (state) => {
            state.settings = initialState.settings;
        },

        // Update multiple settings at once
        updateAOVSettings: (state, action: PayloadAction<Partial<AOVSettings>>) => {
            state.settings = {
                ...state.settings,
                ...action.payload
            };
        }
    }
});

export const { setScale, setFOV, setZoom, resetAOVSettings, updateAOVSettings } = aovSlice.actions;
export default aovSlice.reducer;
