import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Authentication/loginSlice";
import dashboardReducer from './Dashboard/dashboardSlice'
import { chatHistoryReducer } from "./Messages/messagesSlice";

const store = configureStore({
    reducer: {
        login: loginReducer,
        dashboard: dashboardReducer,
        chatHistory:chatHistoryReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;