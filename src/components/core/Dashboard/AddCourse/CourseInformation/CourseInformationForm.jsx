import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import {
  addCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";

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
      // If form is in edit mode, prefill values
      setValue("playlistUrl", course.playlistUrl);
      setValue("courseCategory", course.category);
    }
  }, [editCourse, course, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("playlistUrl", data.playlistUrl);
    formData.append("category", data.courseCategory);
    formData.append("status", "DRAFT");

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    setLoading(false);

    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
      toast.success("Course details saved successfully!");
    } else {
      toast.error("Error saving course details.");
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
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
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
        <IconBtn disabled={loading} text="Next">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
