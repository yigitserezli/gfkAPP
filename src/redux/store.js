import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import refreshReducer from "./slices/refreshSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        refresh: refreshReducer,
    },
});
export default store;