import { LogOut } from "lucide-react";
import { Button } from "@codevs/ui/button";

const LogoutButton = () => {
  return (
    <Button
      variant={"ghost"}
      type="button"
      className="flex items-center justify-start gap-4 px-[10px] h-14 hover:bg-gray-200 rounded-lg"
    >
      <LogOut size={16} />
      <span className="text-[16px]">Log out</span>
    </Button>
  );
};

export default LogoutButton;
