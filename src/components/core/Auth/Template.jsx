import { useSelector } from "react-redux";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center mt-5 mb-28">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex flex-col-reverse md:flex-row mx-auto w-11/12 max-w-maxContentjustify-between py-12 md:gap-x-12">
          <div className="w-[90%] md:w-1/2 mx-auto md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem] mb-5">
              <span className="text-richblack-100">{description1}</span>
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>

            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          <div className="w-full md:w-1/2 relative mx-auto flex justify-center items-center md:mx-0">
            <img src={image} alt="Students" loading="lazy" className="w-[70%] md:w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
