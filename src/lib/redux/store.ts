import { configureStore } from '@reduxjs/toolkit'
import unitReducer from './unitsSlice'
import aovReducer from './features/aov/aovSlice';
export const makeStore = () => {
    return configureStore({
        reducer: {
            units: unitReducer,
            aov: aovReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
