import React from "react";
import { ratingData } from "~/lib/dummyOrders";

const RatingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">
          Rating and feedback
        </h2>
        <div className="flex flex-col lg:flex-row items-center">
          <p className="text-4xl lg:text-8xl text-gray-800">4.8</p>
          <div className="flex flex-col ml-0 lg:ml-4 mt-2 lg:mt-5">
            <span className="text-xl lg:text-2xl text-yellow-400">
              ☆ ☆ ☆ ☆ ☆
            </span>
            <p className="text-gray-500 mb-2 text-sm lg:text-base">
              Average rating
            </p>
          </div>
        </div>
      </div>
      <h3 className="font-light border-b pb-2 text-lg lg:text-xl">Reviews</h3>

      <ul className="mt-2 space-y-4">
        {ratingData.map((item, index) => (
          <li key={index} className="flex flex-col lg:flex-row items-start">
            <div className="w-full lg:w-1/4 mb-2 lg:mb-0">
              <p className="text-base lg:text-lg">{item.name}</p>
              <p className="text-gray-500 text-xs lg:text-sm">{item.email}</p>
            </div>
            <div className="w-full lg:w-1/4 flex items-center mb-2 lg:mb-0">
              <div className="text-yellow-400 text-base lg:text-lg">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <p className="text-gray-500 text-sm lg:text-base">
                {item.feedback}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingCard;
