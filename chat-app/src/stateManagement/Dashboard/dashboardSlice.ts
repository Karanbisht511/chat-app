import { api } from "../api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createResponseState } from "../Authentication/Authentication";

interface friendDetails {
  name: string;
  image?: any;
  imagePath?: any;
}

interface IDashboard {
  friendList: Array<friendDetails>;
  users: Array<string>;
  groups: Array<friendDetails>;
}

const initDashboard = createResponseState<IDashboard>({
  friendList: [],
  users: [],
  groups: [],
});

const initNewChat = {
  status: "idle",
  error: "",
};

export const dashboard = createAsyncThunk("dashboard", async () => {
  const username = sessionStorage.getItem("username");
  console.log("dashboardSlice->username:", username);

  const result = await api.get(`/users/dashboard?username=${username}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
    },
  });
  // Add error logging
  return { result: result.data };
});

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: initDashboard,
  reducers: {
    resetDashboard: () => {
      return initDashboard;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(dashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        dashboard.fulfilled,
        (state, action: PayloadAction<{ result: IDashboard }>) => {
          state.status = "success";
          console.log("Result:", JSON.stringify(action.payload.result));

          const { groups, users, friendList } = action.payload.result;
          // Handling imageUrl as a Blob and creating a URL object for it
          const list = friendList.map(
            ({ name, image, imagePath }: friendDetails) => {
              if (imagePath === null) {
              }

              return {
                name,
                image: imagePath ? image : null,
              };
            }
          );

          // Construct the final response object
          const res: IDashboard = { groups, users, friendList: list };
          state.response = res;
        }
      )
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
    const res = await api.post(
      `/friends/addFriend?username=${username}`,
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
  name: "newChat",
  initialState: {
    response: "",
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
    const res = await api.post(
      `friends/deleteFriend?username=${username}`,
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
  initialState: initNewChat,
  reducers: {
    resetState: (state, action) => {
      if (action.type === "RESET_APP") {
        return initNewChat;
      }
      return state;
    },
  },
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
