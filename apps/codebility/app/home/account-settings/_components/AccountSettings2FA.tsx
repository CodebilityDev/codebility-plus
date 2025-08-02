import { Button } from "@codevs/ui/button";
import { Label } from "@codevs/ui/label";

export default function AccountSettings2FA() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="space-y-0.5">
        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account
        </p>
      </div>
      <Button className="bg-customBlue-200 text-white duration-300 hover:bg-customBlue-300 ">
        Enable 2FA
      </Button>
    </div>
  );
}
