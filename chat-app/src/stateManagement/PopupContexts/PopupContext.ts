import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IContext {
  newChatPopup: boolean;
  chatContextArr: Array<boolean>;
  groupContextArr: Array<boolean>;
  addGroupMembersPopup: boolean;
  createGroupPopup: boolean;
  removeParticipantsPopup: boolean;
  emojiBoxPopup: boolean;
}

const initialState: IContext = {
  newChatPopup: false,
  chatContextArr: [],
  groupContextArr: [],
  addGroupMembersPopup: false,
  createGroupPopup: false,
  removeParticipantsPopup: false,
  emojiBoxPopup: false,
};

const popupContexts = createSlice({
  name: "popupContext",
  initialState,
  reducers: {
    resetState: (state, action) => {
      if (action.type === "RESET_APP") {
        return initialState;
      }
      return state;
    },
    toggleChatContext: (state, action: PayloadAction<{ index: number }>) => {
      state.chatContextArr[action.payload.index] =
        !state.chatContextArr[action.payload.index];
      state.chatContextArr.forEach((_, key) => {
        if (key !== action.payload.index) state.chatContextArr[key] = false;
      });
      state.newChatPopup = false;
      state.removeParticipantsPopup = false;
    },
    toggleGroupContext: (state, action: PayloadAction<{ index: number }>) => {
      state.groupContextArr[action.payload.index] =
        !state.groupContextArr[action.payload.index];
      state.chatContextArr.forEach((_, key) => {
        if (key !== action.payload.index) state.chatContextArr[key] = false;
      });
      state.newChatPopup = false;
      state.removeParticipantsPopup = false;
    },
    toggleNewChat: (state) => {
      state.newChatPopup = !state.newChatPopup;
      state.addGroupMembersPopup = false;
      state.chatContextArr.forEach((_, index) => {
        state.chatContextArr[index] = false;
      });
      state.groupContextArr.forEach((_, index) => {
        state.groupContextArr[index] = false;
      });
      state.removeParticipantsPopup = false;
    },
    toggleAddGroupMember: (state) => {
      state.addGroupMembersPopup = !state.addGroupMembersPopup;
      state.newChatPopup = false;
      state.createGroupPopup = false;
      state.chatContextArr.forEach((_, index) => {
        state.chatContextArr[index] = false;
      });
      state.removeParticipantsPopup = false;
    },
    toggleCreateGroupPopup: (state) => {
      state.createGroupPopup = !state.createGroupPopup;
      state.newChatPopup = false;
      state.addGroupMembersPopup = false;
      state.chatContextArr.forEach((_, index) => {
        state.chatContextArr[index] = false;
      });
      state.removeParticipantsPopup = false;
    },
    toggleRemoveParticpantsPopup: (state) => {
      state.removeParticipantsPopup = !state.removeParticipantsPopup;
      state.newChatPopup = false;
      state.addGroupMembersPopup = false;
      state.chatContextArr.forEach((_, index) => {
        state.chatContextArr[index] = false;
      });
      state.createGroupPopup = false;
    },
    toggleEmotePopup: (state) => {
      state.emojiBoxPopup = !state.emojiBoxPopup;
    },
    closeAllPopUp: (state) => {
      state.newChatPopup = false;
      state.chatContextArr.forEach((_, index) => {
        state.chatContextArr[index] = false;
      });
      state.removeParticipantsPopup = false;
      state.createGroupPopup = false;
    },
  },
});

export default popupContexts.reducer;
export const {
  toggleChatContext,
  toggleNewChat,
  toggleGroupContext,
  toggleAddGroupMember,
  toggleCreateGroupPopup,
  toggleRemoveParticpantsPopup,
  toggleEmotePopup,
  closeAllPopUp,
  resetState
} = popupContexts.actions;
