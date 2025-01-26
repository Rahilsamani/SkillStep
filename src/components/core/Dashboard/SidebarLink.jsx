import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { resetCourseState } from "../../../slices/courseSlice";

export default function SidebarLink({ link, iconName, isOpen }) {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative ${
        isOpen ? "px-8" : ""
      } md:px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-blue-800 text-blue-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem]  bg-blue-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>

      <div
        className={`flex items-center md:justify-start md:gap-x-2 ${
          isOpen ? "justify-start gap-x-2" : "justify-center"
        }`}
      >
        <Icon className="text-2xl md:text-lg" />
        <span className={`md:block ${isOpen ? "block" : "hidden"}`}>
          {link.name}
        </span>
      </div>
    </NavLink>
  );
}
