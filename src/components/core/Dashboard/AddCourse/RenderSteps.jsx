import CourseInformationForm from "./CourseInformation/CourseInformationForm";

export default function RenderSteps() {
  return (
    <>
      <div className="relative mb-2 flex w-full justify-center">
        <div>
          <p className="mb-2 text-md text-richblack-200">
            Easily transform your YouTube playlist into a structured online
            course by adding it here. Select the appropriate category to help
            learners discover your content.
          </p>
        </div>
      </div>

      <CourseInformationForm />
    </>
  );
}
