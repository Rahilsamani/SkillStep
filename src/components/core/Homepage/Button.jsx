import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] md:text-[14px] lg:text-[16px] px-4 py-3 rounded-md font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none hover:scale-95 transition-all duration-200 ${
          active ? "bg-blue-50 text-black " : "bg-richblack-800"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
