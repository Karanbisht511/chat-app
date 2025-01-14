import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Authentication/Authentication";
import { dashboardReducer, newChatReducer, deleteChatReducer } from './Dashboard/dashboardSlice'
import chatHistoryReducer from "./Messages/messagesSlice";
import popupContextReducer from './PopupContexts/PopupContext'
import GroupReducer from './Groups/GroupSlice'

const store = configureStore({
    reducer: {
        login: loginReducer,
        dashboard: dashboardReducer,
        chatHistory: chatHistoryReducer,
        addNewChat: newChatReducer,
        deleteChat: deleteChatReducer,
        contextMenu: popupContextReducer,
        groupContext: GroupReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;