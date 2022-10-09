import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../getStore";

interface IExchange {
  amount: number;
  createdAt: string;
}

interface IWallet {
  amountBlock: number | null;
  amountAvailable: number | null;
}

export interface globalState {
  exchange: IExchange | null;
  wallet: IWallet;
  firstFetch: boolean;
  firstFetchCountries: boolean;
  firstFetchEUOffices: boolean;
  firstFetchDZOffices: boolean;
  firstFetchBanks: boolean;
  firstFetchFees: boolean;
  firstFetchDeliveries: boolean;
  loadingFetchFees: boolean; 
  delivery: any[];
  fees: any[];
  banks: any[];
  countries: any[];
  EUOffices: any[];
  DZOffices: any[];
}

const initialState: globalState = {
  exchange: null,
  firstFetch: true,
  wallet: {
    amountBlock: null,
    amountAvailable: null,
  },
  firstFetchCountries: true,
  countries: [],
  firstFetchEUOffices: true,
  firstFetchDZOffices: true,
  EUOffices: [],
  DZOffices: [],
  delivery: [],
  firstFetchBanks: true,
  banks: [],
  firstFetchFees: true,
  firstFetchDeliveries: true,
  loadingFetchFees: true,
  fees: [{
    preFees: true,
    fee: 0,
    price: 1,
    type: "fix",
  }]
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    onSetExchange: (state, action) => {
      state.exchange = action.payload.exchange;
    },

    onSetAmounBlocked: (state, action) => {
      state.firstFetch = false;
      state.wallet.amountBlock = action.payload.amountBlock;
    },
    onSetAmountAvailable: (state, action) => {
      state.wallet.amountAvailable = action.payload.amountAvailable;
      state.firstFetch = false;
    },
    onSetCountries: (state, action) => {
      state.countries = action.payload.countries;
    },
    onBlockFetchEUOffice: (state) => {
      state.firstFetchEUOffices = false;
    },
    onBlockFetchCountries: (state) => {
      state.firstFetchCountries = false;
    },
    onSetEUOffices: (state, action) => {
      state.EUOffices = action.payload.EUOffices;
      state.firstFetchEUOffices = false;
    },
    onSetDZOffices: (state, action) => {
      state.DZOffices = action.payload.DZOffices;
      state.firstFetchDZOffices = false;
    },
    onBlockFetchBanks: (state) => {
      state.firstFetchBanks = false;
    },
    onSetBanks: (state, action) => {
      state.banks = action.payload.banks; 
    },
    onBlockFetchFees: (state) => {
      state.firstFetchFees = false;
    },
    onSetfees: (state, action) => {
      state.loadingFetchFees = false
      state.fees = action.payload.fees; 
    },
    onSetDeliveries: (state, action) => {
      state.delivery = action.payload.deliveries; 
    },
    onBlockFetchDeliveries: (state) => {
      state.firstFetchDeliveries = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSetBanks,
  onBlockFetchDeliveries,
  onSetDeliveries,
  onBlockFetchFees,
  onSetfees,
  onBlockFetchBanks,
  onSetEUOffices,
  onSetDZOffices,
  onBlockFetchEUOffice,
  onBlockFetchCountries,
  onSetAmounBlocked,
  onSetAmountAvailable,
  onSetCountries,
  onSetExchange,
} = globalSlice.actions;
export const globalState = (state: RootState) => state.global;

export default globalSlice.reducer;
