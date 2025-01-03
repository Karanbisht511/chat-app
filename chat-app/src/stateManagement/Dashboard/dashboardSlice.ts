import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const dashboard = createAsyncThunk(
    'dashboard',
    async () => {
        
        const username = sessionStorage.getItem("username")
        console.log('dashboardSlice->username:',username);
        
        const res = await axios.get(`http://localhost:9000/api/users/dashboard?username=${username}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
            },
        })
        console.log("res:", res);
        return res.data;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dashboard: { friendList: [], users: [] },
        status: 'idle',
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(dashboard.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(dashboard.fulfilled, (state, action) => {
                state.status = 'success';
                state.dashboard = action.payload;
            })
            .addCase(dashboard.rejected, (state, action) => {
                state.status = 'failed';
                if (action.error.message)
                    state.error = action.error.message;
            })
    }

})

export default dashboardSlice.reducer