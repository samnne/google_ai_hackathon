import { createSlice } from "@reduxjs/toolkit";

export const promptSlice = createSlice({
    name: "prompt",
    initialState:{
        value: ""
    },
    reducers:{
        changeValue: (state, action)=>{
            state.value = action.payload;
        }
    }
})

export const {changeValue} = promptSlice.actions
export default promptSlice.reducer