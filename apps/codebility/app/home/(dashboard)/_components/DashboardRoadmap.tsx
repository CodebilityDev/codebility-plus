"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { Step, StepLabel, Stepper } from "@mui/material";

import { fetchUserInternalStatus } from "../actions";

export default function DashboardRoadmap() {
  const { user } = useUserStore();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const steps = ["TRAINING", "GRADUATED", "DEPLOYED"];

  useEffect(() => {
    if (!user?.id) return;

    const fetchStatus = async () => {
      try {
        const status = await fetchUserInternalStatus(user.id);
        console.log("Status fetched:", status);

        const stepIndex = steps.indexOf(status);
        if (stepIndex !== -1) {
          setActiveStep(stepIndex);
        }
      } catch (error) {
        console.error("Error fetching internal status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Roadmap</p>
      <div className="w-full">
        {isLoading ? (
          <div className="flex w-full  gap-4">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : (
          <Stepper activeStep={activeStep} alternativeLabel nonLinear>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel>
                  <span className="text-black dark:text-white">{label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </div>
    </Box>
  );
}
