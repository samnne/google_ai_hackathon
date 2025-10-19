import { createSlice } from "@reduxjs/toolkit";


export const cardListSlice = createSlice({
  name: "cardList",
  initialState: {
    value: [
      
    ],
  },
  reducers: {
    updateList: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateList } = cardListSlice.actions;
export default cardListSlice.reducer;
