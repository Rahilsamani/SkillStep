import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";
import { setLoading } from "../../slices/courseSlice";

const {
  COURSE_CATEGORIES_API,
  CREATE_COURSE_API,
  CREATE_SECTION_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// create a section
export const createSection = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }
    result = response?.data?.updatedCourseDetails;
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token, dispatch) => {
  const toastId = toast.loading("Loading...");
  dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error);
    result = error.response.data;
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  dispatch(setLoading(false));
  return result;
};

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Created");
    success = true;
  } catch (error) {
    success = false;
    console.log("CREATE RATING API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};
