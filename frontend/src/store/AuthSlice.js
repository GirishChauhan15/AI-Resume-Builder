import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
    name: 'Auth',
    initialState:{
            user:null,
            status:false
    },
    reducers:{
        login: (state, action) => {
            state.status = true
            state.user = action.payload
        },  logout: (state, action) => {
            state.status = false
            state.user = null
        }
    }
})

export const {login, logout} = AuthSlice.actions
export default AuthSlice.reducer