import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const dashboard = createAsyncThunk("dashboard", async () => {
  const username = sessionStorage.getItem("username");
  console.log("dashboardSlice->username:", username);

  const res = await axios.get(
    `http://localhost:9000/api/users/dashboard?username=${username}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
      },
    }
  );
  console.log("res:", res);
  return res.data;
});

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: { friendList: [], users: [], groups: [] },
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(dashboard.fulfilled, (state, action) => {
        state.status = "success";
        state.dashboard = action.payload;
      })
      .addCase(dashboard.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) state.error = action.error.message;
      });
  },
}).reducer;

export const addNewChat = createAsyncThunk(
  "newChat",
  async (friend: string) => {
    const username = sessionStorage.getItem("username");
    const res = await axios.post(
      `http://localhost:9000/api/friends/addFriend?username=${username}`,
      {
        frToAdd: friend,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        },
      }
    );
    return res.data;
  }
);

export const newChatReducer = createSlice({
  name: "dashboard",
  initialState: {
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewChat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewChat.fulfilled, (state) => {
        state.status = "success";
        // state.dashboard = action.payload;
      })
      .addCase(addNewChat.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) state.error = action.error.message;
      });
  },
}).reducer;

export const deleteChat = createAsyncThunk(
  "newChat",
  async (friend: string) => {
    const username = sessionStorage.getItem("username");
    const res = await axios.post(
      `http://localhost:9000/api/friends/deleteFriend?username=${username}`,
      {
        frToDelete: friend,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        },
      }
    );
    return res.data;
  }
);

export const deleteChatReducer = createSlice({
  name: "dashboard",
  initialState: {
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteChat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteChat.fulfilled, (state) => {
        state.status = "success";
        // state.dashboard = action.payload;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) state.error = action.error.message;
      });
  },
}).reducer;
