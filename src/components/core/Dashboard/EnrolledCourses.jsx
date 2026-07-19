import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiPlay,
  HiOutlineBookOpen,
  HiCheckCircle,
  HiChevronRight,
  HiOutlineSparkles,
} from "react-icons/hi";
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
        (progress) => progress.courseId === course.courseId._id
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
    <div className="w-full min-h-[calc(100vh-5rem)] pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-richblack-5 tracking-tight flex items-center gap-2.5">
            <span>Enrolled Courses</span>
            <span className="text-sm font-semibold bg-yellow-50/10 text-yellow-50 border border-yellow-50/20 px-3 py-1 rounded-full">
              {enrolledCourses ? enrolledCourses.length : 0} Total
            </span>
          </h1>
          <p className="text-sm text-richblack-300 mt-1 font-medium">
            Track your personalized learning speed, AI insights, and course progress.
          </p>
        </div>
      </div>

      {!enrolledCourses || !coursesProgress ? (
        <div className="grid min-h-[400px] place-items-center bg-richblack-800/40 rounded-2xl border border-richblack-700/60 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="spinner" />
            <p className="text-sm text-richblack-300 font-medium">
              Loading your course dashboard...
            </p>
          </div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] bg-richblack-800/40 rounded-2xl border border-richblack-700/60 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-50/10 border border-yellow-50/20 flex items-center justify-center text-yellow-50 text-2xl mb-4">
            🎓
          </div>
          <h3 className="text-xl font-bold text-richblack-5 mb-2">
            No Enrolled Courses Found
          </h3>
          <p className="text-sm text-richblack-300 max-w-md mb-6">
            You haven't enrolled in any courses yet. Explore our catalog or paste a YouTube playlist to start learning at your custom speed!
          </p>
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-50 text-richblack-900 font-bold text-sm hover:scale-95 transition-all shadow-lg"
          >
            <HiOutlineSparkles className="w-4 h-4" /> Add New Course
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {coursesWithProgress.map((course, i) => {
            const courseData = course.courseId;
            const isCompleted = course.progressPercentage >= 100;
            const firstLessonId = courseData?.courseContent?.[0]?._id;
            const totalLectures = courseData?.courseContent?.length || 0;
            const videosPerDay = course.videosPerDay || 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-2xl border border-richblack-700/80 bg-richblack-800/90 overflow-hidden hover:border-richblack-500/60 shadow-xl transition-all duration-300"
              >
                {/* Course Header Banner */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-richblack-800 via-richblack-800 to-richblack-900/80 flex flex-col md:flex-row md:items-center gap-5 justify-between">
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative group flex-shrink-0">
                      <img
                        src={courseData?.thumbnail}
                        alt={courseData?.Author || "Course Thumbnail"}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover border border-richblack-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      {isCompleted && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-richblack-900 p-1 rounded-full shadow-lg">
                          <HiCheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-yellow-50 bg-yellow-50/10 px-2.5 py-0.5 rounded-md border border-yellow-50/20">
                          ⚡ {videosPerDay} video{videosPerDay > 1 ? "s" : ""}/day
                        </span>
                        {isCompleted ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                            <HiCheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-blue-200 bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-400/30">
                            In Progress
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-richblack-5 truncate tracking-wide">
                        {courseData?.Author}
                      </h2>

                      <div className="flex items-center gap-4 text-xs font-medium text-richblack-300 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <HiOutlineBookOpen className="w-4 h-4 text-yellow-50" />
                          {totalLectures} Lesson{totalLectures !== 1 ? "s" : ""}
                        </span>
                        <span>•</span>
                        <span>
                          Enrolled:{" "}
                          {course.enrollmentDate
                            ? new Date(course.enrollmentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & CTA Button */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-richblack-700/60">
                    <div className="w-full sm:w-48 text-left md:text-right">
                      <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-bold mb-1.5">
                        <span className="text-richblack-300">Progress</span>
                        <span className="text-yellow-50">{course.progressPercentage}%</span>
                      </div>
                      <ProgressBar
                        completed={course.progressPercentage}
                        height="7px"
                        width="100%"
                        isLabelVisible={false}
                        bgColor={
                          isCompleted
                            ? "#34d399"
                            : course.progressPercentage >= 50
                            ? "#818cf8"
                            : "#eab308"
                        }
                        baseBgColor="rgba(255,255,255,0.08)"
                        borderRadius="99px"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (firstLessonId) {
                          navigate(`/view-course/${courseData._id}/${firstLessonId}`);
                        }
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-extrabold text-xs tracking-wide transition-all shadow-md hover:scale-95 cursor-pointer mt-1"
                    >
                      <HiPlay className="w-4 h-4" />
                      <span>{isCompleted ? "Review Course" : "Continue Learning"}</span>
                      <HiChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Progress Insights Section */}
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-richblack-700/80 pt-4">
                    <ProgressInsights courseId={courseData._id} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
