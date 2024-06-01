import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFaliure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    deleteUserFaliure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    userSignoutStart: (state) => {
      state.loading = true;
    },
    userSignoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userSignoutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInFaliure,
  signInSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFaliure,
  userSignoutFailure,
  userSignoutSuccess,
  userSignoutStart,
} = userSlice.actions;

export default userSlice.reducer;
