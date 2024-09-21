import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice"; // Make sure the path is correct

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});

export default store; // Make sure it's a default export
