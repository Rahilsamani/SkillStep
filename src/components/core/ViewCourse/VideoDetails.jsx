import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);
  const [isExpanded, setIsExpanded] = useState(false);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length || !courseId || !sectionId) {
      navigate("/dashboard/enrolled-courses");
      return;
    }

    const currentSection = courseSectionData.find(
      (section) => section._id === sectionId
    );

    if (currentSection) {
      setVideoData(currentSection);
      setPreviewSource(courseEntireData.thumbnail);
      setVideoEnded(false);
    } else {
      navigate("/dashboard/enrolled-courses");
    }
  }, [courseSectionData, courseEntireData, sectionId, navigate, courseId]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    return currentSectionIndex === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    return currentSectionIndex === courseSectionData.length - 1;
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    if (
      currentSectionIndex !== -1 &&
      currentSectionIndex < courseSectionData.length - 1
    ) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      navigate(`/view-course/${courseId}/${nextSectionId}`);
    } else {
      console.log("No next video available.");
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    if (currentSectionIndex > 0) {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      navigate(`/view-course/${courseId}/${prevSectionId}`);
    } else {
      console.log("No previous video available.");
    }
  };

  const handleLectureCompletion = async () => {
    try {
      setLoading(true);
      const res = await markLectureAsComplete(
        { courseId, subsectionId: sectionId },
        token
      );

      if (res) {
        dispatch(updateCompletedLectures(subSectionId));
      }
    } catch (error) {
      console.error("Error completing lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {console.log("video data -> ", videoData)}
      {videoData ? (
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="400px"
          url={`https://www.youtube.com/watch?v=${videoData.videoId}`}
          playing
          controls
          onEnded={() => setVideoEnded(true)}
        />
      ) : (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      )}

      {videoEnded && (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
          }}
          className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
        >
          {!completedLectures.includes(subSectionId) && (
            <IconBtn
              disabled={loading}
              onClick={handleLectureCompletion}
              text={!loading ? "Mark As Completed" : "Loading..."}
              customClasses="text-xl max-w-max px-4 mx-auto"
            />
          )}
          <IconBtn
            text="Rewatch"
            customClasses="text-xl max-w-max px-4 mx-auto mt-2"
            onClick={() => {
              if (playerRef?.current) {
                playerRef.current.seekTo(0);
                setVideoEnded(false);
              }
            }}
          />
          <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
            {!isFirstVideo() && (
              <button onClick={goToPrevVideo} className="blackButton">
                Prev
              </button>
            )}
            {!isLastVideo() && (
              <button onClick={goToNextVideo} className="blackButton">
                Next
              </button>
            )}
          </div>
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <div className="bg-richblack-600 p-5 mb-20 rounded-lg" >
        <p className={`pt-2 pb-6 ${!isExpanded ? "line-clamp-2" : ""}`}>
          {videoData?.description}
        </p>
        <button
          className="text-blue-200 underline"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
};

export default VideoDetails;
