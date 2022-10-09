import { createSlice  } from "@reduxjs/toolkit";
import { RootState } from "../getStore";

export interface sidebarState {
  isOpenRight: boolean; 
  isOpenLeft: boolean;
  transferDetails: any
    
}

const initialState: sidebarState = {
    isOpenRight: false,
    isOpenLeft: false, 
    transferDetails: null 
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onUpdateRightSidebarStatus: (state, action ) => {
        state.isOpenRight = !state.isOpenRight
        state.transferDetails = action.payload
    },
    onUpdateLeftSidebarStatus: (state) => {
        state.isOpenLeft = !state.isOpenLeft 
    }, 
    onClearSideBar: (state) => {
      state.isOpenRight = false
      state.isOpenLeft =false
      state.transferDetails = null
    }
  },
});

// Action creators are generated for each case reducer function
export const { onUpdateRightSidebarStatus, onClearSideBar, onUpdateLeftSidebarStatus  } = sidebarSlice.actions;
export const sidebarState = (state: RootState) => state.sidebar;

export default sidebarSlice.reducer;