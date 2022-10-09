import { createSlice  } from "@reduxjs/toolkit";
import { RootState } from "../getStore";

export interface transferState {
    sent: boolean;
    added: boolean;
    all: boolean;
    countriesAvailbles: any | undefined  
    exchange: number | any
}

const initialState: transferState = {
    all: true,
    sent: false,
    added: true, 
    countriesAvailbles: [],
    exchange: 0
 
};

export const transferSwitchSlice = createSlice({
  name: "transferSwitch",
  initialState,
  reducers: {
    onDisplayAll: (state) => {
        state.all = true
        state.sent = false
        state.sent = false
      },
    onDisplayAdded: (state) => {
        state.all = false
      state.added = true
      state.sent = false
    }, 
    onDisplaySent: (state) => {
        state.all = false
        state.added = false
        state.sent = true
    },
    onSetCountriesAvaible: (state, action) => {
      state.countriesAvailbles = action.payload
    },
    exchangebitch: (state, action) => {
      state.exchange = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { exchangebitch, onDisplayAdded, onDisplaySent, onDisplayAll, onSetCountriesAvaible } = transferSwitchSlice.actions;
export const transferSwitchState = (state: RootState) => state.transferSwitch;

export default transferSwitchSlice.reducer;