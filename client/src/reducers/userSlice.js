import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "curUser",
  initialState: {
    value: null,
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload) {
        state.value = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          emailVerified: action.payload.emailVerified,
          
        };
      } else {
        state.value = null;
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
