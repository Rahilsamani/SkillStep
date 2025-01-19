import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  course: null,
  paymentLoading: false,
  loading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setCourse, resetCourseState, setLoading } = courseSlice.actions;

export default courseSlice.reducer;
