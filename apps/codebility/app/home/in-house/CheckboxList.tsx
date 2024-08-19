import { useEffect, useState } from "react";
import { Checkbox } from "@codevs/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/constants";
import axios from "axios";

interface Project {
  id: string;
  project_name: string;
}

interface ICheckboxListProps {
  initialItems?: { project: Project }[];
  handleChange: (value: { project: Project }[]) => void;// eslint-disable-line no-unused-vars
  className?: string
}

export default function CheckboxList({ initialItems = [], handleChange, className }: ICheckboxListProps) {
  const [items, setItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const { data: projects_list, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["projects_list"],
    queryFn: async () => {
      const response = await axios.get(`${API.PROJECTS}`);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (projects_list) {
      const projectNames = projects_list.map((project) => project.project_name);
      setItems(projectNames);

      const initialCheckedItems = initialItems.reduce<{ [key: string]: boolean }>((acc, item) => {
        const projectMatch = projects_list.find((project) => project.id === item.project.id);
        if (projectMatch) {
          acc[projectMatch.project_name] = true;
        }
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
    }
  }, [projects_list, initialItems]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prevState) => {
      const updatedCheckedItems = { ...prevState, [item]: !prevState[item] };
      const transformedData = Object.keys(updatedCheckedItems)
        .filter((key) => updatedCheckedItems[key])
        .map((projectName) => {
          const project = projects_list?.find((project) => project.project_name === projectName);
          return project ? { project: { id: project.id, project_name: projectName } } : null;
        })
        .filter(Boolean) as { project: Project }[];

      handleChange(transformedData);
      return updatedCheckedItems;
    });
  };

  if (isLoading) return (
    <div className="animate-pulse flex gap-2">
      <span className="rounded-sm border border-zinc-700 bg-zinc-700 w-4 h-4"></span>
      <span className="rounded-sm border border-zinc-700 bg-zinc-700 w-20 h-4"></span>
    </div>
  );

  if (isError) return <span>Error</span>;

  return (
    <div className={`flex flex-col ${className}`}>
      {items.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            onCheckedChange={() => handleCheckboxChange(item)}
            id={`checkbox-${item}`}
            checked={!!checkedItems[item]}
          />
          <label htmlFor={`checkbox-${item}`}>{item}</label>
        </div>
      ))}
    </div>
  );
}
