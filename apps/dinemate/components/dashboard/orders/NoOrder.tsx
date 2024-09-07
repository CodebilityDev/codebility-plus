import React from "react";

interface NoOrderProps {
  status: "new" | "preparing" | "serving";
}

function NoOrder({ status }: NoOrderProps) {
  const getMessage = () => {
    switch (status) {
      case "new":
        return "No New Orders Yet";
      case "preparing":
        return "No Preparing Orders Yet";
      case "serving":
        return "No Serving Orders Yet";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-center py-4 px-6 bg-white rounded-lg border border-gray-300 shadow-md h-full w-full text-xl">
      {getMessage()}
    </div>
  );
}

export default NoOrder;
