import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints, categories } from "../apis";
import { setLoading } from "../../slices/courseSlice";

const {
  COURSE_CATEGORIES_API,
  CREATE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  GET_PROGRESS_INSIGHTS_API,
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

// create a new course category (Admin only)
export const addCategory = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      categories.CREATE_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Create Category");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE CATEGORY API ERROR............", error);
    toast.error(error.response?.data?.message || error.message);
  }
  return result;
};

// update a course category (Admin only)
export const editCategory = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      categories.UPDATE_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Update Category");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE CATEGORY API ERROR............", error);
    toast.error(error.response?.data?.message || error.message);
  }
  return result;
};

// delete a course category (Admin only)
export const removeCategory = async (data, token) => {
  let success = false;
  try {
    const response = await apiConnector(
      "POST",
      categories.DELETE_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Category");
    }
    success = true;
  } catch (error) {
    console.log("DELETE CATEGORY API ERROR............", error);
    toast.error(error.response?.data?.message || error.message);
  }
  return success;
};

// add the course details (server now handles YouTube fetch + bulk section creation)
export const addCourseDetails = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    result = response?.data?.data;
    result.user = response?.data?.user;
    result.exist = response?.data?.exist;
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token, dispatch) => {
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

// get AI progress insights for a course
export const getProgressInsights = async (courseId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_PROGRESS_INSIGHTS_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Progress Insights");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_PROGRESS_INSIGHTS_API ERROR............", error);
  }
  return result;
};
