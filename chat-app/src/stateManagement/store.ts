import { configureStore, Middleware } from "@reduxjs/toolkit";
import loginReducer from "./Authentication/Authentication";
import {
  dashboardReducer,
  newChatReducer,
  deleteChatReducer,
} from "./Dashboard/dashboardSlice";
import chatHistoryReducer from "./Messages/messagesSlice";
import popupContextReducer from "./PopupContexts/PopupContext";
import GroupReducer from "./Groups/GroupSlice";
import fileReducer from "./Messages/file";

const logger: Middleware = () => (next) => (action: any) => {
  console.log("Dispatching action:", action.type);
  console.log("Action payload:", action.payload);
  const result = next(action);
  console.log("New state:", store.getState());
  return result;
};

const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: dashboardReducer,
    chatHistory: chatHistoryReducer,
    addNewChat: newChatReducer,
    deleteChat: deleteChatReducer,
    contextMenu: popupContextReducer,
    groupContext: GroupReducer,
    fileContext: fileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
