import React, { useState } from "react";
import { motion } from "framer-motion";

type ToggleSwitchProps = {
  // eslint-disable-next-line no-unused-vars
  onClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  enabled?: boolean;
  // Other props...
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onClick,
  enabled = false,
}) => {
  const [settingEnabled, setSettingEnabled] = useState(enabled);

  // accepts the correct type of event (React.MouseEvent<HTMLInputElement, MouseEvent>)
  const toggleSetting = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    setSettingEnabled((prevState) => !prevState);
    onClick(event); // passes this event to the onClick function.
  };

  return (
    <div
      onClick={toggleSetting}
      className={`relative flex h-5 w-10 cursor-pointer items-center gap-4 rounded-full border border-gray-300 p-2 transition-colors ${
        settingEnabled ? "bg-gray-700 dark:bg-gray-600" : "bg-gray-300 dark:bg-gray-700"
      }`}
    >
      <motion.div
        className={`absolute h-4 w-4 rounded-full ${settingEnabled ? "bg-white" : "bg-white"}`}
        animate={{ marginLeft: settingEnabled ? "-10%" : "34%" }}
        transition={{ type: "spring", stiffness: 700, damping: 60 }}
      />
    </div>
  );
};

export default ToggleSwitch;
