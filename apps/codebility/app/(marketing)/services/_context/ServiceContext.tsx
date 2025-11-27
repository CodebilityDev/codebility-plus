"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { ServiceProject } from "../_components";

interface ServiceContextType {
  activeService: ServiceProject | null;
  setActiveService: (service: ServiceProject) => void;
  clearActiveService: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [activeService, setActiveServiceState] =
    useState<ServiceProject | null>(null);

  const setActiveService = (service: ServiceProject) =>
    setActiveServiceState(service);
  const clearActiveService = () => setActiveServiceState(null);

  return (
    <ServiceContext.Provider
      value={{ activeService, setActiveService, clearActiveService }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context)
    throw new Error("useServiceContext must be used within ServiceProvider");
  return context;
};
