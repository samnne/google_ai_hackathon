import { configureStore } from "@reduxjs/toolkit";
import promptReducer  from "../reducers/promptSlice";
import rootReducer  from "../reducers/rootSlice";
import cardListReducer from "../reducers/cardListSlice"
import userReducer from "../reducers/userSlice"
export const store = configureStore({
    reducer: {
        prompt: promptReducer,
        rootCard: rootReducer,
        cardList: cardListReducer,
        curUser: userReducer
    }
})