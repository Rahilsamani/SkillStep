import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getUserEnrolledCourses,
  getUserCoursesProgress,
} from "../../../services/operations/profileAPI";
import ProgressInsights from "./ProgressInsights";

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
      <div className="text-3xl text-richblack-50 mb-6 font-semibold">
        Enrolled Courses
      </div>
      {!enrolledCourses || !coursesProgress ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {coursesWithProgress.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden hover:border-richblack-600 transition-colors duration-200"
            >
              {/* Clickable course header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-richblack-700/30 transition-colors"
                onClick={() => {
                  navigate(
                    `/view-course/${course.courseId._id}/${course.courseId.courseContent?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.courseId.thumbnail}
                  alt="course_img"
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-richblack-5 truncate">
                    {course.courseId.Author}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-richblack-400">
                      {course.progressPercentage}%
                    </span>
                    <div className="flex-1 max-w-[200px]">
                      <ProgressBar
                        completed={course.progressPercentage}
                        height="6px"
                        width="100%"
                        isLabelVisible={false}
                        bgColor={
                          course.progressPercentage >= 100
                            ? "#34d399"
                            : course.progressPercentage >= 50
                            ? "#818cf8"
                            : "#60a5fa"
                        }
                        baseBgColor="rgba(255,255,255,0.08)"
                        borderRadius="99px"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Progress Insights */}
              <div className="px-4 pb-4 pt-0">
                <div className="border-t border-richblack-700 pt-3">
                  <ProgressInsights courseId={course.courseId._id} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
