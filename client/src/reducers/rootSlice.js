import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../utils/utils";


export const rootSlice = createSlice({
  name: "rootCard",
  initialState: {
    value: [...initialState],
  },
  reducers: {
    createCard: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { createCard } = rootSlice.actions;
export default rootSlice.reducer;