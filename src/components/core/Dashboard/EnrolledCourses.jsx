import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserEnrolledCourses,
  getUserCoursesProgress,
} from "../../../services/operations/profileAPI";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [coursesProgress, setCoursesProgress] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };

  const getCoursesProgress = async () => {
    try {
      const res = await getUserCoursesProgress(token);
      setCoursesProgress(res);
    } catch (error) {
      console.log("Could not fetch courses progress.");
    }
  };

  const mergeCoursesWithProgress = () => {
    if (!enrolledCourses || !coursesProgress) return [];

    return enrolledCourses.map((course) => {
      const progressData = coursesProgress.find(
        (progress) => progress.courseId === course._id
      );

      return {
        ...course,
        progressPercentage: progressData ? progressData.progress : 0,
      };
    });
  };

  useEffect(() => {
    getEnrolledCourses();
    getCoursesProgress();
  }, []);

  const coursesWithProgress = mergeCoursesWithProgress();

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses || !coursesProgress ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex justify-between rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-[45%] px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {coursesWithProgress.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course.courseId._id}/${course.courseId.courseContent?.[0]._id}`
                  );
                }}
              >
                <img
                  src={course.courseId.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseId.Author}</p>
                </div>
              </div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage}%</p>
                <ProgressBar
                  completed={course.progressPercentage}
                  height="8px"
                  width="400px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
