"use client";

import { useState, useEffect } from "react";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Copy, Check, Info, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@codevs/ui/tooltip";
import { checkUsernameAvailability, updateUsername, getUsernameData } from "../action";
import { useToast } from "@codevs/ui/use-toast";

interface AccountSettingsUsernameProps {
  userId: string;
}

export default function AccountSettingsUsername({ userId }: AccountSettingsUsernameProps) {
  const [username, setUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean | null;
    message: string;
  }>({ available: null, message: "" });
  const [cooldownDays, setCooldownDays] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch current username data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUsernameData(userId);
      if (result.success && result.data) {
        setCurrentUsername(result.data.username || "");
        
        // Calculate cooldown
        if (result.data.username_updated_at) {
          const lastUpdate = new Date(result.data.username_updated_at);
          const now = new Date();
          const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
          const remaining = Math.max(0, 30 - daysSinceUpdate);
          setCooldownDays(remaining);
        } else {
          setCooldownDays(0);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 8) {
      setAvailabilityStatus({ available: null, message: "" });
      return;
    }

    // Don't check if it's the same as current username
    if (username.toLowerCase() === currentUsername.toLowerCase()) {
      setAvailabilityStatus({ 
        available: null, 
        message: "This is your current username" 
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setChecking(true);
      const result = await checkUsernameAvailability(username, userId);
      setChecking(false);

      if (result.available) {
        setAvailabilityStatus({
          available: true,
          message: "Username is available",
        });
      } else {
        setAvailabilityStatus({
          available: false,
          message: result.error || "Username is not available",
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username, userId, currentUsername]);

  const handleChangeUsername = async () => {
    if (!username || username.length < 8) return;
    
    if (cooldownDays && cooldownDays > 0) {
      toast({
        title: "Cannot update username",
        description: `You can change your username again in ${cooldownDays} day${cooldownDays !== 1 ? 's' : ''}`,
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    const result = await updateUsername(userId, username);
    setUpdating(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      setCurrentUsername(username);
      setUsername("");
      setCooldownDays(30);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update username",
        variant: "destructive",
      });
    }
  };

  const copyAccountId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask the account ID showing only last 4 characters
  const maskedAccountId = userId.replace(/.(?=.{4})/g, "x");

  const isUsernameValid = username.length >= 8 && availabilityStatus.available === true;
  const canUpdate = isUsernameValid && (!cooldownDays || cooldownDays === 0);

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-6 w-6 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <h3 className="text-2xl font-semibold">Account Identity</h3>
            <TooltipContent className="max-w-xs">
              <p className="text-base">
                Your username is your unique identifier. The username must be at least 8 characters.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        {/* Current Username Display */}
        
          <div className="bg-gray-800/50 rounded-md">
            <p className="text-lg text-foreground">Current username</p>
            <p className="text-base font-medium text-muted-foreground">{currentUsername || "No username set."}</p>
          </div>
      

        {/* Cooldown Warning */}
        {cooldownDays !== null && cooldownDays > 0 && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-md">
            <p className="text-sm text-yellow-200">
              ⏳ You can change your username again in {cooldownDays} day{cooldownDays !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-lg font-medium">
            New Username
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="Enter new username"
                className="flex-1 text-base pr-10"
                minLength={8}
                maxLength={30}
                disabled={cooldownDays !== null && cooldownDays > 0}
              />
              {/* Availability Indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                {!checking && availabilityStatus.available === true && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {!checking && availabilityStatus.available === false && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <Button
              onClick={handleChangeUsername}
              disabled={!canUpdate || updating}
              className="shrink-0 bg-[#5B68C8] hover:bg-[#4A56B7] disabled:bg-gray-600 disabled:opacity-50"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change username"
              )}
            </Button>
          </div>
          
          {/* Status Message */}
          {availabilityStatus.message && (
            <p className={`text-sm ${
              availabilityStatus.available === true 
                ? "text-green-400" 
                : availabilityStatus.available === false 
                ? "text-red-400" 
                : "text-gray-400"
            }`}>
              {availabilityStatus.message}
            </p>
          )}
          
          <p className="text-sm text-gray-400">
            8-30 characters. Letters, numbers, periods, and underscores only.
          </p>
        </div>

        {/* Account ID Field */}
        <div className="space-y-2">
          <Label htmlFor="account-id" className="text-lg font-medium">
            Account ID
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="account-id"
              type="text"
              value={maskedAccountId}
              readOnly
              disabled
              className="flex-1 font-mono text-base"
            />
            <Button
              onClick={copyAccountId}
              variant="ghost"
              size="icon"
              className="shrink-0"
              type="button"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Your unique Codevs account identifier
          </p>
        </div>
      </div>
    </div>
  );
}