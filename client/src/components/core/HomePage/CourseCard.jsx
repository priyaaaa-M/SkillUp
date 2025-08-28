import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import { FiArrowRight } from "react-icons/fi";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      className={`w-full sm:w-[360px] lg:w-[30%] relative overflow-hidden rounded-xl border transition-all duration-300 ${isActive
        ? "border-caribbeangreen-300 bg-white shadow-lg shadow-caribbeangreen-100/50 transform -translate-y-2"
        : "border-richblack-600 bg-richblack-800 hover:bg-richblack-700"
        } text-richblack-25 h-[320px] cursor-pointer group`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-caribbeangreen-400 to-caribbeangreen-600"></div>
      )}

      <div className="h-[70%] p-6 flex flex-col gap-4 border-b border-dashed border-richblack-500">
        <div className={`flex justify-between items-start gap-4`}>
          <h3 className={`text-xl font-bold ${isActive ? "text-richblack-800" : "text-white"
            }`}>
            {cardData?.heading}
          </h3>

          {isActive && (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-caribbeangreen-100 text-caribbeangreen-600">
              <FiArrowRight className="text-sm" />
            </span>
          )}
        </div>

        <p className={`text-sm ${isActive ? "text-richblack-600" : "text-richblack-300"
          } line-clamp-4`}>
          {cardData?.description}
        </p>
      </div>

      <div className={`h-[30%] px-6 py-4 flex justify-between items-center ${isActive ? "bg-caribbeangreen-50" : "bg-richblack-900"
        }`}>
        {/* Level */}
        <div className={`flex items-center gap-3 ${isActive ? "text-richblack-700" : "text-richblack-200"
          }`}>
          <div className={`p-2 rounded-full ${isActive
            ? "bg-caribbeangreen-100 text-caribbeangreen-600"
            : "bg-richblack-700 text-richblack-25"
            }`}>
            <HiUsers className="text-lg" />
          </div>
          <span className="text-sm font-medium">{cardData?.level}</span>
        </div>

        {/* Lessons */}
        <div className={`flex items-center gap-3 ${isActive ? "text-richblack-700" : "text-richblack-200"
          }`}>
          <div className={`p-2 rounded-full ${isActive
            ? "bg-caribbeangreen-100 text-caribbeangreen-600"
            : "bg-richblack-700 text-richblack-25"
            }`}>
            <ImTree className="text-lg" />
          </div>
          <span className="text-sm font-medium">{cardData?.lessionNumber} Lessons</span>
        </div>
      </div>

      {/* Hover overlay effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-richblack-800 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      )}
    </div>
  );
};

export default CourseCard;