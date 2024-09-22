import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/brand_logo.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const Support = [
  "Legal policy",
  "Status policy",
  "Status policy",
  "Terms of service",
  "Cookie Policy",
];

const Services = [
  {
    name: "Home",
  },
  {
    name: "Courses",
  },
  {
    name: "About Us",
  },
  {
    name: "Contact Us",
  },
  {
    name: "FAQ",
  },
  {
    name: "Privacy Policy",
  },
  {
    name: "Terms & Conditions",
  },
];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="grid grid-cols-1 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4 justify-between  gap-y-10 w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        {/* Section 1 */}
        <div className="flex flex-col gap-5 items-center sm:items-start">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="logo"
              width={180}
              height={50}
              className="object-contain"
            />
          </div>

          <p className="text-xs">Copyright © 2024 SkillStep</p>

          <div className="flex gap-3 text-lg mt-8">
            <FaFacebook className="transition-colors duration-200 cursor-pointer rounded-full hover:text-blue-5 " />
            <FaGoogle className="transition-colors duration-200 cursor-pointer rounded-full hover:text-blue-5 " />
            <FaTwitter className="transition-colors duration-200 cursor-pointer rounded-full hover:text-blue-5 " />
            <FaYoutube className="transition-colors duration-200 cursor-pointer rounded-full hover:text-blue-5 " />
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h1 className="text-richblack-50 font-semibold text-[16px]">
            Services
          </h1>
          {Services.map((ele, index) => (
            <div
              key={index}
              className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2"
            >
              <Link target="blank" to={ele.link}>
                {ele.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Section 3 */}
        <div>
          <h1 className="text-richblack-50 font-semibold text-[16px]">
            Support
          </h1>
          {Support.map((ele, index) => (
            <div
              key={index}
              className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2"
            >
              <Link to={`/${ele}`}>{ele}</Link>
            </div>
          ))}
        </div>

        {/* Section 4 */}
        <div>
          <h1 className="text-richblack-50 font-semibold text-[16px]">
            Get Updates
          </h1>
          <label className="w-full">
            <input
              required
              type="email"
              placeholder="Enter email address"
              name="email"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="bg-richblack-800 rounded-[0.5rem] mt-2 border border-richblack-300 text-richblack-5 w-full p-[12px] max-w-[350px]"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Footer;
