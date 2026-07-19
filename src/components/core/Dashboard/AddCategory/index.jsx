import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { VscFolder, VscEdit, VscTrash } from "react-icons/vsc";
import {
  addCategory,
  editCategory,
  removeCategory,
  fetchCourseCategories,
} from "../../../../services/operations/courseDetailsAPI";
import IconBtn from "../../../common/IconBtn";
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function AddCategory() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const loadCategories = async () => {
    setFetchingCategories(true);
    const res = await fetchCourseCategories();
    if (res) {
      setCategoriesList(res);
    }
    setFetchingCategories(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    reset({ name: "", description: "" });
  };

  const handleDeleteCategory = (categoryId) => {
    setConfirmationModal({
      text1: "Are you sure?",
      text2: "This category will be deleted permanently.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        setConfirmationModal(null);
        const toastId = toast.loading("Deleting category...");
        const success = await removeCategory({ categoryId }, token);
        toast.dismiss(toastId);
        if (success) {
          toast.success("Category deleted successfully!");
          if (editingCategory?._id === categoryId) {
            handleCancelEdit();
          }
          loadCategories();
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const onSubmit = async (data) => {
    if (editingCategory) {
      // Update Category
      const toastId = toast.loading("Updating category...");
      try {
        setLoading(true);
        const res = await editCategory(
          {
            categoryId: editingCategory._id,
            name: data.name,
            description: data.description,
          },
          token
        );

        if (res) {
          toast.success("Category updated successfully!");
          handleCancelEdit();
          loadCategories();
        }
      } catch (error) {
        console.error("Error updating category:", error);
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    } else {
      // Create Category
      const toastId = toast.loading("Creating category...");
      try {
        setLoading(true);
        const res = await addCategory(
          {
            name: data.name,
            description: data.description,
          },
          token
        );

        if (res) {
          toast.success("Category created successfully!");
          reset();
          loadCategories();
        }
      } catch (error) {
        console.error("Error creating category:", error);
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-medium text-richblack-5">
            Manage Categories
          </h1>
          <p className="text-sm text-richblack-200">
            Create, update, and manage categories for organizing courses on SkillStep. (Admin Only)
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-richblack-5">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-richblack-300 underline hover:text-richblack-100"
              >
                Cancel Editing
              </button>
            )}
          </div>

          {/* Category Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="name">
              Category Name <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="name"
              placeholder="Enter Category Name (e.g., Web Development)"
              {...register("name", { required: true })}
              className="form-style w-full"
            />
            {errors.name && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Category name is required
              </span>
            )}
          </div>

          {/* Category Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="description">
              Category Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="description"
              rows="3"
              placeholder="Enter brief description of this category"
              {...register("description", { required: true })}
              className="form-style w-full resize-none"
            />
            {errors.description && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Category description is required
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-x-3">
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-50 hover:bg-richblack-600"
              >
                Cancel
              </button>
            )}
            <IconBtn
              disabled={loading}
              text={editingCategory ? "Update Category" : "Create Category"}
            >
              <VscFolder />
            </IconBtn>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">
            All Categories ({categoriesList.length})
          </h2>

          {fetchingCategories ? (
            <div className="grid h-24 place-items-center">
              <div className="spinner"></div>
            </div>
          ) : categoriesList.length === 0 ? (
            <p className="text-center text-richblack-300">
              No categories created yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoriesList.map((cat) => (
                <div
                  key={cat._id}
                  className="flex flex-col justify-between rounded-lg border border-richblack-700 bg-richblack-900 p-4 transition-all duration-200 hover:border-richblack-600"
                >
                  <div>
                    <div className="flex items-start justify-between gap-x-2">
                      <h3 className="text-lg font-medium text-richblack-5">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-x-2">
                        <button
                          title="Edit Category"
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 text-richblack-300 hover:text-yellow-50 transition-colors"
                        >
                          <VscEdit size={18} />
                        </button>
                        <button
                          title="Delete Category"
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-1.5 text-richblack-300 hover:text-pink-200 transition-colors"
                        >
                          <VscTrash size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-richblack-300">
                      {cat.description}
                    </p>
                  </div>
                  {cat.courses && (
                    <div className="mt-4">
                      <span className="inline-block rounded-full bg-richblack-800 px-3 py-1 text-[11px] text-richblack-200 border border-richblack-700">
                        {cat.courses.length}{" "}
                        {cat.courses.length === 1 ? "Course" : "Courses"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
}
