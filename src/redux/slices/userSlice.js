import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            console.log("User set:", action.payload);
            AsyncStorage.setItem("user", JSON.stringify(action.payload));
        },
        removeUser: (state) => {
            state.user = null;
            AsyncStorage.removeItem("user");
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
