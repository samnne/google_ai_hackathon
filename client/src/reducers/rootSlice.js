import { createSlice } from "@reduxjs/toolkit";


export const rootSlice = createSlice({
  name: "rootCard",
  initialState: {
    value: [],
  },
  reducers: {
    createCard: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { createCard } = rootSlice.actions;
export default rootSlice.reducer;