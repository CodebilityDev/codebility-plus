import { Client } from "@/types/home/codev";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy text");
  }
};

export const convertTime12h = (time: string) => {
  const [hour, minute] = time.split(":");
  let formattedTime = "";
  if (!hour) return;
  if (+hour === 0) {
    formattedTime = `12:${minute} AM`;
  } else if (+hour === 12) {
    formattedTime = `12:${minute}`;
  } else if (+hour > 12) {
    formattedTime = `${+hour - 12}:${minute}`;
  } else {
    formattedTime = `${+hour}:${minute}`;
  }

  return formattedTime;
};

export const handleDownload = (clients: Client[]) => {
  const formattedData = clients.map((appointment) => ({ ...appointment }));
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
  XLSX.writeFile(workbook, "clients.xlsx");
};
