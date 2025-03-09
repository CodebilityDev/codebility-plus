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
      className={`bg-gray relative flex h-5 w-10 cursor-pointer items-center gap-4 rounded-full border-black p-2 ${
        settingEnabled ? "bg-opacity-20" : " bg-opacity-30"
      }`}
    >
      <motion.div
        className={`absolute h-4 w-4 rounded-full ${settingEnabled ? "dark:bg-light-800 bg-slate-600" : "dark:bg-teal bg-blue-100"}`}
        animate={{ marginLeft: settingEnabled ? "-10%" : "34%" }}
        transition={{ type: "spring", stiffness: 700, damping: 60 }}
      />
    </div>
  );
};

export default ToggleSwitch;
