import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import {
  addCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
const axios = require("axios");

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

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

    if (editCourse) {
      setValue("playlistUrl", course.playlistUrl);
      setValue("courseCategory", course.category);
    }
  }, [editCourse, course, setValue]);

  const apiSecretKey = "AIzaSyBMb5GkBMSwCqAA2eR6FVksssDa9n9biF8";

  async function fetchAllPlaylistItems(playlistId) {
    let allItems = [];
    let nextPageToken = "";

    do {
      // Fetch the playlist data
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50${
          nextPageToken ? `&pageToken=${nextPageToken}` : ""
        }&key=${apiSecretKey}`
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

    console.log("All Items -> ", allItems);

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

      console.log("Course Sections -> ", courseSections);

      // Prepare form data for submission
      const formData = new FormData();
      formData.append("playlistUrl", data.playlistUrl);
      formData.append("category", data.courseCategory);
      formData.append("courseSections", JSON.stringify(courseSections));

      const firstSectionDetails = courseSections[0];

      console.log("First Section -> ", firstSectionDetails);

      // Send form data
      setLoading(true);
      const result = await addCourseDetails(formData, token);
      setLoading(false);

      // Check if course details were successfully added
      if (result) {
        dispatch(setCourse(result));
        toast.success("Course Created successfully!");
      } else {
        toast.error("Error saving course details.");
      }
    } catch (error) {
      console.error("Error fetching playlist items or saving course:", error);
      toast.error("An error occurred. Please try again.");
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

      {/* Submit Button */}
      <div className="flex justify-end gap-x-2">
        <IconBtn disabled={loading} text="Submit">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
