import { configureStore } from "@reduxjs/toolkit";
import {
  surveySlice
} from "./slices";


const store = configureStore({
  reducer: {
    survey: surveySlice,
  },
});

export default store;