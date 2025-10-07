"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Wifi, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaderboardError as LeaderboardErrorType } from "@/types/leaderboard";

interface LeaderboardErrorProps {
  error: LeaderboardErrorType;
  onRetry?: () => void;
  className?: string;
}

const getErrorIcon = (error: LeaderboardErrorType) => {
  const code = error.code?.toLowerCase() || "";
  const message = error.message.toLowerCase();
  
  if (code.includes("network") || message.includes("network") || message.includes("fetch")) {
    return <Wifi className="h-8 w-8 text-orange-500" />;
  }
  
  if (code.includes("db") || code.includes("sql") || message.includes("database")) {
    return <Database className="h-8 w-8 text-red-500" />;
  }
  
  return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
};

const getErrorTitle = (error: LeaderboardErrorType) => {
  const code = error.code?.toLowerCase() || "";
  const message = error.message.toLowerCase();
  
  if (message.includes("unauthorized") || code === "401") {
    return "Access Denied";
  }
  
  if (message.includes("network") || message.includes("fetch")) {
    return "Connection Problem";
  }
  
  if (code.includes("db") || code.includes("sql") || message.includes("database")) {
    return "Database Error";
  }
  
  if (message.includes("validation") || code === "400") {
    return "Invalid Request";
  }
  
  return "Something Went Wrong";
};

const getErrorDescription = (error: LeaderboardErrorType) => {
  const code = error.code?.toLowerCase() || "";
  const message = error.message.toLowerCase();
  
  if (message.includes("unauthorized") || code === "401") {
    return "You don't have permission to view this leaderboard. Please check your account status.";
  }
  
  if (message.includes("network") || message.includes("fetch")) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }
  
  if (code.includes("db") || code.includes("sql") || message.includes("database")) {
    return "There's a problem with the database. Our team has been notified and is working on a fix.";
  }
  
  if (message.includes("validation") || code === "400") {
    return "The request contains invalid data. Please refresh the page and try again.";
  }
  
  if (message.includes("not found") || code === "404") {
    return "The leaderboard data you're looking for could not be found.";
  }
  
  return "An unexpected error occurred. Please try again in a few moments.";
};

const getErrorActions = (error: LeaderboardErrorType, onRetry?: () => void) => {
  const code = error.code?.toLowerCase() || "";
  const message = error.message.toLowerCase();
  
  if (message.includes("unauthorized") || code === "401") {
    return (
      <Button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Refresh Page
      </Button>
    );
  }
  
  if (onRetry) {
    return (
      <Button
        onClick={onRetry}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    );
  }
  
  return (
    <Button
      onClick={() => window.location.reload()}
      className="bg-gray-600 hover:bg-gray-700 text-white"
    >
      Refresh Page
    </Button>
  );
};

const LeaderboardError: React.FC<LeaderboardErrorProps> = ({ 
  error, 
  onRetry,
  className = "" 
}) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className={`rounded-lg border border-red-200 dark:border-red-800 p-8 text-center bg-red-50 dark:bg-red-950/50 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {getErrorIcon(error)}
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {getErrorTitle(error)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            {getErrorDescription(error)}
          </p>
          
          {/* Show technical details in development */}
          {isDev && error.details && (
            <details className="mb-4">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Technical Details
              </summary>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-left">
                <p><strong>Error:</strong> {error.message}</p>
                {error.code && <p><strong>Code:</strong> {error.code}</p>}
                {error.details && <p><strong>Details:</strong> {error.details}</p>}
              </div>
            </details>
          )}
        </div>
        
        {getErrorActions(error, onRetry)}
      </div>
    </div>
  );
};

export default LeaderboardError;