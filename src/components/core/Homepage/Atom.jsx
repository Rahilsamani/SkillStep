import "./Atom.css";
import Amazon from "../../../assets/Images/amazon.webp";
import Apple from "../../../assets/Images/apple.webp";
import Google from "../../../assets/Images/google.webp";
import Netflix from "../../../assets/Images/netflix.webp";
import Microsoft from "../../../assets/Images/microsoft.webp";
import Meta from "../../../assets/Images/meta.webp";
import Adobe from "../../../assets/Images/adobe.webp";
import Linkedin from "../../../assets/Images/linkedin.webp";
import Flipkart from "../../../assets/Images/flipkart.webp";
import Ola from "../../../assets/Images/ola.webp";

const Atom = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        {/* Outer rotating container */}
        <div className="rounded-full h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] border-2 border-blue-100 flex justify-center items-center outer-spin-animation">
          <img
            src={Amazon}
            alt="amazon-logo"
            className="absolute -top-[47px] sm:-top-[75px] logo w-[100px] sm:w-[150px]"
          />
          <img
            src={Apple}
            alt="apple-logo"
            className="absolute top-[20px] -right-7 sm:-right-[50px] sm:top-[70px] logo w-[100px] sm:w-[150px]"
          />
          <img
            src={Google}
            alt="google-logo"
            className="absolute top-[20px] -left-7 sm:-left-[50px] sm:top-[70px] logo w-[100px] sm:w-[150px]"
          />
          <img
            src={Netflix}
            alt="netflix-logo"
            className="absolute -bottom-[47px] sm:-bottom-[75px] logo w-[100px] sm:w-[150px]"
          />
          <img
            src={Microsoft}
            alt="microsoft-logo"
            className="absolute -left-[32px] bottom-[35px] sm:-left-[35px] sm:bottom-[40px] logo w-[100px] sm:w-[150px]"
          />
          <img
            src={Meta}
            alt="meta-logo"
            className="absolute bottom-[35px] -right-[32px] sm:-right-[35px] sm:bottom-[40px] logo w-[100px] sm:w-[150px]"
          />

          {/* Inner rotating container */}
          <div className="bg-blue-100 w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full flex justify-center items-center">
            <div className="bg-richblack-900 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] rounded-full relative inner-spin-animation">
              <img
                src={Adobe}
                alt="adobe-logo"
                className="absolute top-[7px] -left-[50px] sm:-left-[72px] sm:top-[24px] inner-logo w-[100px] sm:w-[150px]"
              />
              <img
                src={Linkedin}
                alt="linkedin-logo"
                className="absolute top-[7px] -right-[50px] sm:-right-[72px] sm:top-[24px] inner-logo w-[100px] sm:w-[150px]"
              />
              <img
                src={Flipkart}
                alt="flipkart-logo"
                className="absolute -bottom-[50px] left-2 sm:left-[23px] sm:-bottom-[75px] inner-logo w-[100px] sm:w-[150px]"
              />
              <img
                src={Ola}
                alt="ola-logo"
                className="absolute -top-[50px] right-2 sm:left-[23px] sm:-top-[70px] inner-logo w-[100px] sm:w-[150px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atom;
