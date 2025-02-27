import { api } from "../api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IoldMsgs } from "../../components/Messages";

interface IintialState {
  messages: Array<IoldMsgs>;
  status: string;
  error: string;
}

const chatHistoryInitState: IintialState = {
  messages: [],
  status: "idle",
  error: "",
};

export const chatHistory = createAsyncThunk(
  "chatHistory",
  async (input: { indexName: string; isGroup: boolean }) => {
    if (input.isGroup) {
      const res = await api.get(
        `/users/getGroupChats?index=${input.indexName}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
          },
        }
      );
      return res.data.messages;
    } else {
      const username = sessionStorage.getItem("username");
      const res = await api.post(
        `/users/getChats?username=${username}`,
        { friend: input.indexName },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
          },
        }
      );
      return res.data.messages;
    }
  }
);

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState: chatHistoryInitState,
  reducers: {

    cleanUpChat: (state) => {
      state.messages = [];
    },
    appendMessage: (
      state,
      action: PayloadAction<{
        msgBy: string;
        isFile: boolean;
        msg: string;
        timeStamp: Date;
      }>
    ) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(chatHistory.fulfilled, (state, action) => {
        state.status = "success";
        state.messages = action.payload;
      })
      .addCase(chatHistory.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) state.error = action.error.message;
      });
  },
});

export default chatHistorySlice.reducer;
export const { cleanUpChat, appendMessage } = chatHistorySlice.actions;
