import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import {
  addCourseDetails,
  createSection,
  fetchCourseCategories,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import IconBtn from "../../../common/IconBtn";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const user = useSelector((state) => state.profile.user._id);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    getCategories();
  }, [course, setValue]);

  async function fetchAllPlaylistItems(playlistId) {
    let allItems = [];
    let nextPageToken = "";

    do {
      // Fetch the playlist data
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50${
          nextPageToken ? `&pageToken=${nextPageToken}` : ""
        }&key=${process.env.REACT_APP_Youtube_API_KEY}`
      );

      // Parse the JSON response
      const data = await response.json();

      // Check if items exist in the response
      if (data.items) {
        allItems = allItems.concat(data.items);
      }

      // Get the next page token, if any
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return allItems;
  }

  const validatePlaylistUrl = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:playlist\?list=)([A-Za-z0-9_-]{34})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  function getPlaylistId(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("list");
  }

  const onSubmit = async (data) => {
    // Validate playlist URL
    const isValid = validatePlaylistUrl(data.playlistUrl);
    if (!isValid) {
      toast.error("Please Enter a Valid URL");
      return;
    }

    // Extract playlistId from the URL
    const playlistId = getPlaylistId(data.playlistUrl);

    try {
      // Fetch all playlist items
      const courseSections = await fetchAllPlaylistItems(playlistId);

      if (!courseSections || courseSections.length === 0) {
        toast.error("No sections found in the playlist.");
        return;
      }

      // Prepare form data for submission
      const formData = new FormData();
      formData.append("youtubePlaylistId", data.playlistUrl);
      formData.append("userId", user);
      formData.append("category", data.courseCategory);
      formData.append("videosPerDay", data.videosPerDay);

      const firstSectionDetails = courseSections[0].snippet;
      formData.append("Author", firstSectionDetails.videoOwnerChannelTitle);
      formData.append("thumbnail", firstSectionDetails.thumbnails.high.url);

      // Send form data
      setLoading(true);
      const result = await addCourseDetails(formData, token);

      if (result && result._id && !result.exist) {
        let dayCount = 0;
        for (let i = 0; i < courseSections.length; i++) {
          if (i % data.videosPerDay === 0) {
            dayCount += 1;
          }

          const section = courseSections[i];
          if (section && section.snippet) {
            const { title, thumbnails, description, resourceId } =
              section.snippet;
            const sectionThumbnail = thumbnails.high.url;
            const videoId = resourceId.videoId;

            const availableOn = new Date(Date.now());
            availableOn.setDate(availableOn.getDate() + dayCount);

            await createSection(
              {
                title,
                thumbnail: sectionThumbnail,
                description,
                videoId,
                courseId: result._id,
                availableOn,
              },
              token
            );
          }
        }

        dispatch(setCourse(result));
        toast.success("Course Created successfully!");
      } else if (result.exist) {
        toast.success("Course Created successfully!");
      } else {
        toast.error("Error saving course details.");
      }
    } catch (error) {
      console.error("Error fetching playlist items or saving course:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* YouTube Playlist URL */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="playlistUrl">
          YouTube Playlist URL <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="playlistUrl"
          placeholder="Enter YouTube Playlist URL"
          {...register("playlistUrl", { required: true })}
          className="form-style w-full"
        />
        {errors.playlistUrl && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Playlist URL is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled selected>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category) => (
              <option key={category?._id} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>

        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Number of Videos per Day */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="videosPerDay">
          Videos Per Day <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="videosPerDay"
          type="number"
          placeholder="Enter number of videos per day"
          {...register("videosPerDay", {
            required: true,
            min: 1,
            valueAsNumber: true,
          })}
          className="form-style w-full"
        />
        {errors.videosPerDay && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Please enter a valid number greater than 0
          </span>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-x-2">
        <IconBtn disabled={loading} text="Submit">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
