import { createSlice } from "@reduxjs/toolkit";
import { initialStateList } from "../utils/utils";


export const cardListSlice = createSlice({
  name: "cardList",
  initialState: {
    value: [
      ...initialStateList
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
