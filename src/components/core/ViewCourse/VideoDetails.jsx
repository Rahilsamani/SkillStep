import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";

const VideoDetails = () => {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const { courseSectionData, courseEntireData } = useSelector(
    (state) => state.viewCourse
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !sectionId) {
      navigate("/dashboard/enrolled-courses");
      return;
    }

    if (courseSectionData.length === 0) {
      return;
    }

    const currentSection = courseSectionData.find(
      (section) => section._id === sectionId
    );

    setVideoData(currentSection);
    setPreviewSource(courseEntireData.thumbnail);

    setLoading(false);
  }, [courseSectionData, courseEntireData, sectionId, navigate, courseId]);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 text-white items-center mt-10">
      {videoData ? (
        <ReactPlayer
          ref={playerRef}
          width="90%"
          height="400px"
          url={`https://www.youtube.com/watch?v=${videoData.videoId}`}
          playing
          controls
        />
      ) : (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>

      {courseEntireData?.discordLink && (
        <div className="bg-richblack-600 px-5 py-2 rounded-lg">
          Join the discord server for this course:{" "}
          <Link
            className="text-caribbeangreen-200"
            to={courseEntireData?.discordLink}
            target="_blank"
          >
            Discord Link
          </Link>
        </div>
      )}

      <div className="bg-richblack-600 p-5 mb-20 rounded-lg">
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
