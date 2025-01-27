import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";

import { logout } from "../../../services/operations/authAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  const sidebarLinks = [
    {
      id: 1,
      name: "My Profile",
      path: "/dashboard/my-profile",
      icon: "VscAccount",
    },
    {
      id: 2,
      name: "Add Course",
      path: "/dashboard/add-course",
      icon: "VscAdd",
    },
    {
      id: 3,
      name: "Enrolled Courses",
      path: "/dashboard/enrolled-courses",
      icon: "VscMortarBoard",
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Tracks of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex h-[calc(100vh-3.5rem)] w-20 md:w-52 transition-width duration-300 flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 ${
          isOpen ? "w-52" : "w-20"
        }`}
      >
        <div className="flex flex-col">
          <button
            className={`text-richblack-300 text-2xl flex md:justify-start md:px-8 items-center -mt-6 mb-3 md:hidden ${
              isOpen ? "justify-end pr-5" : "justify-center"
            }`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <IoCloseSharp size={26} /> : <FiMenu size={26} />}
          </button>
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
                isOpen={isOpen}
              />
            );
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-full bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            isOpen={isOpen}
          />

          <button
            className="md:px-8 py-4 text-sm font-medium text-richblack-300"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <div
              className={`flex items-center md:justify-start md:gap-x-2 ${
                isOpen ? "justify-start gap-x-2 px-8" : "justify-center"
              }`}
            >
              <VscSignOut className="text-2xl md:text-lg" />
              <span className={`md:block ${isOpen ? "block" : "hidden"}`}>
                Logout
              </span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
