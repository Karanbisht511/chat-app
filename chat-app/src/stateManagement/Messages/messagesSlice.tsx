import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IoldMsgs } from "../../components/Messages";

interface IintialState {
    messages: Array<IoldMsgs>;
    status: string;
    error: string;
}

const chatHistoryInitState:IintialState={
    messages: [],
    status: 'idle',
    error: ''
}

export const groupChatHistory = createAsyncThunk(
    'groupChatHistory',
    async (groupName: string) => {

        const res = await axios.get(`http://localhost:9000/api/users/getGroupChats?index=${groupName}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
            }
        });
        return res.data.messages;
    }
)

export const singleChatHistory = createAsyncThunk(
    'singleChatHistory',
    async (indexName: string) => {
        const username = sessionStorage.getItem('username')
        const res = await axios.post(`http://localhost:9000/api/users/getChats?username=${username}`, { friend: indexName }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
            }
        });
        return res.data.messages;
    }
)

export const chatHistory = createAsyncThunk(
    'chatHistory',
    async (input: { indexName: string, isGroup: boolean }) => {

        if (input.isGroup) {
            const res = await axios.get(`http://localhost:9000/api/users/getGroupChats?index=${input.indexName}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
                }
            });
            return res.data.messages;
        } else {
            const username = sessionStorage.getItem('username')
            const res = await axios.post(`http://localhost:9000/api/users/getChats?username=${username}`, { friend: input.indexName }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
                }
            });
            return res.data.messages;
        }
    })

    const ChatHistorySlice = createSlice({
        name: 'chatHistory',
        initialState: chatHistoryInitState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(chatHistory.pending, (state) => {
                    state.status = 'loading'
                })
                .addCase(chatHistory.fulfilled, (state, action) => {
                    state.status = 'success';
                    state.messages = action.payload;
                })
                .addCase(chatHistory.rejected, (state, action) => {
                    state.status = 'failed';
                    if (action.error.message)
                        state.error = action.error.message;
                });
        }
    }).reducer;


export { ChatHistorySlice as chatHistoryReducer }
