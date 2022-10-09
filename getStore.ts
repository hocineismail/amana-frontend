import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import  globalState  from "./features/globalSlice";
import  sidebarState from "./features/sidebarSlice";
import  transferSwitchState  from "./features/transferSwitch";
import userState   from "./features/userSlice";
 

// import counterReducer from "./reducers/testRedoursers";
// import productsReducer from "./reducers/productsReducers";
 
export const store = configureStore({
  devTools:true,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: false
  // }) ,
  reducer: {
    transferSwitch: transferSwitchState,
    sidebar: sidebarState,
    user: userState,
    global: globalState
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;