import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import {
  addCourseDetails,
  fetchCourseCategories,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import IconBtn from "../../../common/IconBtn";
import { setUser } from "../../../../slices/profileSlice";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
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
  }, [course]);

  const validatePlaylistUrl = (url) => {
    if (!url) return null;
    try {
      const regex =
        /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:playlist\?list=|watch\?.*list=)([A-Za-z0-9_-]+)/;
      const match = url.trim().match(regex);
      if (match) return match[1];

      // Fallback using URL API
      const urlObj = new URL(url.trim());
      const listId = urlObj.searchParams.get("list");
      if (listId && listId.length > 0) return listId;
    } catch {
      // Allow direct playlist ID string if entered
      if (/^[A-Za-z0-9_-]{10,}$/.test(url.trim())) {
        return url.trim();
      }
    }
    return null;
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Loading...");

    // Validate playlist URL
    const isValid = validatePlaylistUrl(data.playlistUrl);
    if (!isValid) {
      toast.dismiss(toastId);
      toast.error("Please Enter a Valid URL");
      return;
    }

    try {
      setLoading(true);

      // Send everything to the server — it handles YouTube fetching,
      // caching, and bulk section creation
      const result = await addCourseDetails(
        {
          playlistUrl: data.playlistUrl,
          category: data.courseCategory,
          videosPerDay: data.videosPerDay,
          isEnded: data.isEnded || false,
          userId: user,
        },
        token
      );

      if (result) {
        dispatch(setUser(result.user));
        dispatch(setCourse(result));
        toast.success("Course Created successfully!");
      } else {
        toast.error("Error saving course details.");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      toast.dismiss(toastId);
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
          defaultValue=""
        >
          <option value="" disabled>
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

      {/* Is Playlist Ended */}
      <div className="flex items-center space-x-3">
        <input
          id="isEnded"
          type="checkbox"
          {...register("isEnded")}
          className="h-4 w-4 rounded border-richblack-600 bg-richblack-700 text-yellow-50 focus:ring-yellow-50"
        />
        <label className="text-sm text-richblack-5" htmlFor="isEnded">
          This playlist is complete (no new videos will be added)
        </label>
      </div>
      <p className="text-xs text-richblack-300 -mt-4 ml-7">
        Check this if the playlist is finalized.
      </p>

      {/* Submit Button */}
      <div className="flex justify-end gap-x-2">
        <IconBtn disabled={loading} text="Submit">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
