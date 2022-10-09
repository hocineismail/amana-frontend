import { createSlice  } from "@reduxjs/toolkit";
import { RootState } from "../getStore";

export interface usersState {
    userDetails: any
 
    
}

const initialState: usersState = {
    userDetails: null,
 
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    onSetUserDetails: (state, action) => {
        state.userDetails = action.payload
    },
 
    onDisplaySent: (state) => {
  
    },
  },
});

// Action creators are generated for each case reducer function
export const {  onDisplaySent, onSetUserDetails } = usersSlice.actions;
export const userState = (state: RootState) => state.user;

export default usersSlice.reducer;