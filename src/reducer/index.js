import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import courseReducer from "../slices/courseSlice";
import viewCourseReducer from "../slices/viewCourseSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  viewCourse: viewCourseReducer,
});

export default rootReducer;
