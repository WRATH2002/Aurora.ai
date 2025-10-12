import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../utils/themeConstants";

export const globalSlice = createSlice({
  name: "global",
  initialState: { currentTheme: lightTheme },
  reducers: {
    // incrementCounter: (state) => {
    //   state.mainCounter += 1;
    // },
    // decrementCounter: (state) => {
    //   state.mainCounter -= 1;
    // },
    // toggleFlag: (state) => {
    //   state.counterContinueFlag = !state.counterContinueFlag;
    // },
    // toggleFlagTrue: (state) => {
    //   state.counterContinueFlag = true;
    // },
    // toggleFlagFalse: (state) => {
    //   state.counterContinueFlag = false;
    // },
    updateCurrenTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    // showData: (state) => {
    //   console.log("Stored to database => " + state.mainCounter);
    // },
  },
});

export const { updateCurrenTheme } = globalSlice.actions;

export default globalSlice.reducer;
