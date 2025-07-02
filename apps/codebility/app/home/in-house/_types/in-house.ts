import React from "react";
import { Codev } from "@/types/home/codev";

export interface InHouseProps {
  data: Codev[];
  editableIds: string[];
  handlers: {
    setData: React.Dispatch<React.SetStateAction<Codev[]>>;
    handleEditButton: (id: string) => void;
    handleSaveButton: (updatedMember: Codev) => void;
  };
  status: {
    LoadinginHouse: boolean;
    ErrorinHouse: Error | null;
  };
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface InHouseEditable {
  data: Codev;
  handleSaveButton: InHouseProps["handlers"]["handleSaveButton"];
}

export type InHouseSort = (key: keyof Codev, direction: "up" | "down") => void;

export type MemberStats = {
  total: number;
  active: number;
  inactive: number;
};
