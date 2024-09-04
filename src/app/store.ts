import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import dataReducer from './data/dataSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        data: dataReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;