import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: false,
    student: false,
}

const refreshSlice = createSlice({
    name : 'refresh',
    initialState,
    reducers: {
        setDashboardRefresh: (state, action) => {
            state.dashboard = action.payload; //true or false
        },
        setStudentRefresh: (state, action) => {
            state.student = action.payload; //true or false
        }
    }
})

export const { setDashboardRefresh, setStudentRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;