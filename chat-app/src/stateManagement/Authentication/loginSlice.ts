import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Icredentials {
    username: string,
    password: string
}

interface IinitState {
    loginDetails: {
        isUserAuthenticated: boolean;
        token: string;
        userInfo: {
            email: string;
            mobile: string;
            username: string;
        };
        username: string;
    };
    status: string;
    error: string;
}

const initialState: IinitState = {
    loginDetails: {
        isUserAuthenticated: false,
        token: '',
        userInfo: {
            email: '',
            mobile: '',
            username: ''
        },
        username: ''
    },
    status: 'idle',
    error: ''
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
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'success';
                state.loginDetails = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                if (action.error.message)
                    state.error = action.error.message;
            });
    }
});

export default loginSlice.reducer;