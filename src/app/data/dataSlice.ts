import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, createData, updateData, deleteData } from '../../utils/api';
import { RootState } from '../store';

interface DataItem {
    id?: string;
    companySigDate: string;
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSigDate: string;
    employeeSignatureName: string;
}

interface DataState {
    data: DataItem[];
    isLoading: boolean;
    error: string | null;
}

const initialState: DataState = {
    data: [],
    isLoading: false,
    error: null,
};

export const fetchDataThunk = createAsyncThunk(
    'data/fetchData',
    async (token: string) => {
        const response = await fetchData(token);
        return response;
    }
);

export const createDataThunk = createAsyncThunk(
    'data/createData',
    async ({ token, newData }: { token: string; newData: DataItem }) => {
        const response = await createData(token, newData);
        return response.data;
    }
);

export const updateDataThunk = createAsyncThunk(
    'data/updateData',
    async ({ token, id, updatedData }: { token: string; id: string; updatedData: DataItem }) => {
        const response = await updateData(token, id, updatedData);
        return response.data;
    }
);

export const deleteDataThunk = createAsyncThunk(
    'data/deleteData',
    async ({ token, id }: { token: string; id: string }) => {
        await deleteData(token, id);
        
        return id;
    }
);

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDataThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchDataThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch data';
            })

            .addCase(createDataThunk.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })

            .addCase(updateDataThunk.fulfilled, (state, action) => {
                const index = state.data.findIndex(item => item.id === action.payload.id);

                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            .addCase(deleteDataThunk.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            })
    },
});

export const selectData = (state: RootState) => state.data.data;
export const selectDataIsLoading = (state: RootState) => state.data.isLoading;
export const selectDataError = (state: RootState) => state.data.error;

export default dataSlice.reducer;