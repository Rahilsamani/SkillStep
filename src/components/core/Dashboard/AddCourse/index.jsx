import CourseInformationForm from "./CourseInformationForm";

export default function AddCourse() {
  return (
    <>
      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="mb-5 text-3xl font-medium text-richblack-5">
            Add Course
          </h1>
          <div className="flex-1">
            <div className="relative mb-2 flex w-full justify-center">
              <div>
                <p className="mb-2 text-md text-richblack-200">
                  Easily transform your YouTube playlist into a structured
                  online course by adding it here. Select the appropriate
                  category to help learners discover your content.
                </p>
              </div>
            </div>

            <CourseInformationForm />
          </div>
        </div>
      </div>
    </>
  );
}
