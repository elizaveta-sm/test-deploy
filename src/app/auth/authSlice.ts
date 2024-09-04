import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { login } from '../../utils/api';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
};

export const authenticateUser = createAsyncThunk<string, { username: string; password: string }, { rejectValue: string }>(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {

        try {
            const response = await login(username, password);

            if (!response.data?.token) {
                return rejectWithValue('Incorrect username or password.');
            }

            localStorage.setItem('token', response.data.token);
            return response.data.token;

        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unexpected error occurred.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;