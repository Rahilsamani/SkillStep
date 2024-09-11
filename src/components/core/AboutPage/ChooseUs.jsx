import React from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaCertificate,
  FaTrophy,
  FaEnvelope,
} from "react-icons/fa";
import HighlightText from "../Homepage/HighlightText";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <FaCalendarAlt />,
      title: "Structured Learning",
      description:
        "Structured, alternate-day learning plans that fit into your schedule.",
    },
    {
      icon: <FaChartLine />,
      title: "Progress Tracking",
      description:
        "Personalized progress tracking dashboards to monitor your development.",
    },
    {
      icon: <FaCertificate />,
      title: "Completion Certificates",
      description:
        "Completion certificates to showcase your achievements and new skills.",
    },
    {
      icon: <FaTrophy />,
      title: "Gamified Learning",
      description:
        "Gamified rewards, badges, and leaderboards to keep you motivated.",
    },
    {
      icon: <FaEnvelope />,
      title: "Stay Notified",
      description:
        "Email notifications for new lessons, updates, and progress reminders.",
    },
  ];

  return (
    <div className="w-11/12 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-richblack-50">
          Why Choose <HighlightText text={"SkillStep "} />?
        </h2>
        <p className="text-xl text-richblack-400 mt-4">
          Discover the benefits of structured and engaging learning on
          SkillStep.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-richblack-200 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <div className="text-blue-500 text-5xl mb-4">{benefit.icon}</div>
            <h3 className="text-2xl font-semibold text-richblack-800 mb-3">
              {benefit.title}
            </h3>
            <p className="text-richblack-800">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
