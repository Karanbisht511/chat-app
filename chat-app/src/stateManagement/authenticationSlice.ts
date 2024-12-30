import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Icredentials {
    username: string,
    password: string
}

export const loginUser = createAsyncThunk(
    'login',
    async (payload: Icredentials) => {
        const loginRes = await axios.post('http://localhost:9000/api/users/login', payload);
        console.log('Result:', loginRes.data);
        sessionStorage.setItem('JWTToken', loginRes.data?.token)
        sessionStorage.setItem('username', loginRes.data?.username)
        return loginRes.data;
    }
)

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        loginDetails: {},
        status: 'idle',
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.
            addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'success';
                state.loginDetails = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                if (action.error.message)
                    state.error = action.error.message;
            });
    }
});

export default loginSlice.reducer;