import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
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
      <div className="text-3xl text-richblack-50 mb-4">Enrolled Courses</div>
      {!enrolledCourses || !coursesProgress ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <Table className="my-8 w-full text-richblack-5 border border-richblack-700">
          <Thead className="bg-richblack-500">
            <Tr>
              <Th className="p-4 text-left w-[55%]">Course Name</Th>
              <Th className="p-4 text-left w-[45%]">Progress</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coursesWithProgress.map((course, i) => (
              <Tr
                key={i}
                className="border-b border-richblack-700 hover:bg-richblack-600"
                onClick={() => {
                  navigate(
                    `/view-course/${course.courseId._id}/${course.courseId.courseContent?.[0]._id}`
                  );
                }}
              >
                <Td className="p-4 cursor-pointer flex items-center gap-4">
                  <img
                    src={course.courseId.thumbnail}
                    alt="course_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{course.courseId.Author}</p>
                  </div>
                </Td>
                <Td className="p-4">
                  <p>Progress: {course.progressPercentage}%</p>
                  <ProgressBar
                    completed={course.progressPercentage}
                    height="8px"
                    width="100%"
                    isLabelVisible={false}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}
