import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface IGroup {
    addPartipants: {
        parToAdd: Array<string>,
        status: string,
        error: string,
        result: string,
    }
    removeParticipant: {
        groupName: string
        status: string,
        error: string,
        result: string,
    }
}

let initialState: IGroup = {
    addPartipants: {
        parToAdd: [],
        status: 'idle',
        error: '',
        result: '',
    },
    removeParticipant: {
        groupName: '',
        status: 'idle',
        error: '',
        result: '',
    }

}

export const addNewGroup = createAsyncThunk(
    'createGroup',
    async (payload: { groupName: string, participants: string[] }) => {
        const { groupName, participants } = payload

        const res = await axios.post(`http://localhost:9000/api/group/create`, {
            admin: sessionStorage.getItem('username'),
            groupName,
            participants
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
            }
        });
        return res.data.messages;
    }
)

export const removeParticipant = createAsyncThunk(
    'removeParticipant',
    async (input: { groupName: string }) => {
        const payload = {
            groupName: input.groupName,
            participant: sessionStorage.getItem('username')
        }
        const res = await axios.post(`http://localhost:9000/api/group/removeParticipant`,
            payload
            , {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
                }
            });
        return res.data.messages;
    }
)

const groupSlice = createSlice({
    name: 'createGroup',
    initialState,
    reducers: {
        addParticipants: (state, action: PayloadAction<{ participant: string }>) => {
            state.addPartipants.parToAdd.push(action.payload.participant);
        },
        removePart: (state, action: PayloadAction<{ groupName: string }>) => {
            state.removeParticipant.groupName = action.payload.groupName
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewGroup.pending, (state) => {
                state.addPartipants.status = 'loading'
            })
            .addCase(addNewGroup.fulfilled, (state, action) => {
                state.addPartipants.status = 'success';
                state.addPartipants.result = action.payload;
            })
            .addCase(addNewGroup.rejected, (state, action) => {
                state.addPartipants.status = 'failed';
                if (action.error.message)
                    state.addPartipants.error = action.error.message;
            })
            .addCase(removeParticipant.pending, (state) => {
                state.removeParticipant.status = 'loading'
            })
            .addCase(removeParticipant.fulfilled, (state, action) => {
                state.removeParticipant.status = 'success';
                state.removeParticipant.result = action.payload;
            })
            .addCase(removeParticipant.rejected, (state, action) => {
                state.removeParticipant.status = 'failed';
                if (action.error.message)
                    state.removeParticipant.error = action.error.message;
            })
    }
});



// export const removePartipantSlice = createSlice({
//     name: 'createGroup',
//     initialState,
//     reducers: {
//         // removePart: (state, action: PayloadAction<{ participant: string }>) => {
//         //     state.parToRemove = action.payload.participant;
//         // }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(removeParticipant.pending, (state) => {
//                 state.status = 'loading'
//             })
//             .addCase(removeParticipant.fulfilled, (state, action) => {
//                 state.status = 'success';
//                 state.result = action.payload;
//             })
//             .addCase(removeParticipant.rejected, (state, action) => {
//                 state.status = 'failed';
//                 if (action.error.message)
//                     state.error = action.error.message;
//             });
//     }
// });

// export const { removePart } = removePartipantSlice.actions
export const { addParticipants, removePart } = groupSlice.actions
export default groupSlice.reducer
