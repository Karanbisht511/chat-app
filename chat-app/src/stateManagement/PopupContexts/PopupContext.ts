import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IContext {
    newChatPopup: boolean,
    chatContextArr: Array<boolean>,
    addGroupMembersPopup: boolean,
    createGroupPopup: boolean,
    removeParticipantsPopup: boolean,
}

const initialState: IContext = {
    newChatPopup: false,
    chatContextArr: [],
    addGroupMembersPopup: false,
    createGroupPopup: false,
    removeParticipantsPopup: false,
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
            state.removeParticipantsPopup = false;
        },
        toggleNewChat: (state) => {
            state.newChatPopup = !state.newChatPopup;
            state.addGroupMembersPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
            state.removeParticipantsPopup = false;
        },
        toggleAddGroupMember: (state) => {
            state.addGroupMembersPopup = !state.addGroupMembersPopup;
            state.newChatPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
            state.removeParticipantsPopup = false;
        },
        toggleCreateGroupPopup: (state) => {
            state.createGroupPopup = !state.createGroupPopup;
            state.newChatPopup = false;
            state.addGroupMembersPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
            state.removeParticipantsPopup = false;
        },
        toggleRemoveParticpantsPopup: (state) => {
            state.removeParticipantsPopup = !state.removeParticipantsPopup
            state.newChatPopup = false;
            state.addGroupMembersPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
            state.createGroupPopup = false;
        },
        closeAllPopUp: (state) => {
            state.newChatPopup = false;
            state.chatContextArr.forEach((e, index) => {
                state.chatContextArr[index] = false;
            });
            state.removeParticipantsPopup = false;
            state.createGroupPopup = false;
        }
    }
})

export default popupContexts.reducer;
export const { toggleChatContext, toggleNewChat, toggleAddGroupMember, toggleCreateGroupPopup, toggleRemoveParticpantsPopup, closeAllPopUp } = popupContexts.actions;
