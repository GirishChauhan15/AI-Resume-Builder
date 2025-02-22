import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from './AuthSlice'

const store = configureStore({
  reducer:{auth:AuthSlice},
  devTools:false
})


export default store
