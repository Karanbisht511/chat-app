import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IContext {
    newChatPopup: boolean,
    chatContextArr: Array<boolean>
}

const initialState: IContext = {
    newChatPopup: false,
    chatContextArr: []
};

const popupContexts = createSlice({
    name: 'popupContext',
    initialState,
    reducers: {
        toggleChatContext: (state, action: PayloadAction<{ index: number }>) => {
            state.chatContextArr[action.payload.index] = !state.chatContextArr[action.payload.index]
            state.chatContextArr.forEach((e, key) => {
                if (key !== action.payload.index)
                    state.chatContextArr[key] = false;
            });
            state.newChatPopup = false;
        },
        toggleNewChat: (state) => {
            state.newChatPopup = !state.newChatPopup;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
        },
        closeOtherPopUp: (state) => {
            state.newChatPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
        }
    }
})

export default popupContexts.reducer;
export const { toggleChatContext, toggleNewChat } = popupContexts.actions;