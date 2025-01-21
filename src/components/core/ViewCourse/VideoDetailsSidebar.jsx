import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const [enrollmentDate, setEnrollmentDate] = useState(null);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const activeSectionId = courseSectionData[currentSectionIndx]?._id;
    setVideoBarActive(activeSectionId);

    const course = user.courses.find(
      (course) => course.courseId === courseEntireData._id
    );

    if (course && course.enrollmentDate) {
      setEnrollmentDate(new Date(course.enrollmentDate));
    }
  }, [courseSectionData, courseEntireData, location.pathname, sectionId]);

  const getAvailableSections = (sections, enrollmentDate) => {
    if (!enrollmentDate) return [];

    const currentDate = new Date();

    return sections.filter((section) => {
      console.log("Section -> ", section);
      const releaseDate = new Date(enrollmentDate);
      console.log("Release Date -> ", releaseDate);
      releaseDate.setDate(releaseDate.getDate() + section.releaseOffset);
      console.log("New Release Date -> ", releaseDate);

      return releaseDate <= currentDate;
    });
  };

  const handleLectureCompletion = async (sectionId) => {
    try {
      setLoading(true);
      const courseId = courseEntireData?._id;

      if (!courseId) {
        console.error("Course ID is missing");
        return;
      }

      const res = await markLectureAsComplete({ courseId, sectionId }, token);

      if (res) {
        dispatch(updateCompletedLectures(sectionId));
      }
    } catch (error) {
      console.error("Error completing lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!videoBarActive ? (
        <div className="grid h-screen w-screen place-items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
          <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-2 text-lg font-bold text-richblack-25">
            <div className="flex w-full items-center justify-between mt-5">
              <div
                onClick={() => {
                  navigate(`/dashboard/enrolled-courses`);
                }}
                title="back"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-richblack-100 text-richblack-700 pr-1 hover:scale-90"
              >
                <IoIosArrowBack size={25} />
              </div>
              <IconBtn
                text="Add Review"
                customClasses="ml-auto"
                onclick={() => setReviewModal(true)}
              />
            </div>

            <div className="flex flex-col">
              <p>{courseEntireData?.Author}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures?.length} / {totalNoOfLectures}
              </p>
            </div>
          </div>

          <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
            {enrollmentDate &&
              getAvailableSections(courseSectionData, enrollmentDate).map(
                (section, index) => (
                  <div
                    className={`mt-2 cursor-pointer text-sm text-richblack-25 ${
                      videoBarActive === section._id
                        ? "bg-blue-200 font-semibold text-white"
                        : "hover:bg-richblack-900"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/${section?._id}`
                      );
                      setVideoBarActive(section._id);
                    }}
                    key={index}
                  >
                    {/* Section */}
                    <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                      <div className="w-[90%] text-[13px]">
                        {section?.title}
                      </div>

                      <input
                        type="checkbox"
                        checked={completedLectures.includes(section?._id)}
                        onChange={() => handleLectureCompletion(section?._id)}
                      />
                    </div>
                  </div>
                )
              )}
            {/* Display message if no sections are available */}
            {enrollmentDate &&
              getAvailableSections(courseSectionData, enrollmentDate).length ===
                0 && (
                <p className="text-center text-sm text-richblack-500 mt-4">
                  No sections available yet.
                </p>
              )}
          </div>
        </div>
      )}
    </>
  );
}
