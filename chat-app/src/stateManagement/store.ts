import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Authentication/loginSlice";
import { dashboardReducer, newChatReducer, deleteChatReducer } from './Dashboard/dashboardSlice'
import { chatHistoryReducer } from "./Messages/messagesSlice";
import popupContextReducer from './PopupContexts/PopupContext'

const store = configureStore({
    reducer: {
        login: loginReducer,
        dashboard: dashboardReducer,
        chatHistory: chatHistoryReducer,
        addNewChat: newChatReducer,
        deleteChat: deleteChatReducer,
        contextMenu: popupContextReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;