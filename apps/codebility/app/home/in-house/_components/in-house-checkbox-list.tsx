import { useEffect, useState } from "react";
import { Checkbox } from "@codevs/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";
import { Project } from '@/types/home/codev'

interface ICheckboxListProps {
  initialItems?: Project[];
  handleChange: (value: Project[]) => void;// eslint-disable-line no-unused-vars
  className?: string
}

export default function CheckboxList({ initialItems = [], handleChange, className }: ICheckboxListProps) {
  const [items, setItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const { data: projects_list, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["projects_list"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.from("project")
      .select(); 
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (projects_list) {
      const projectNames = projects_list.map((project) => project.name);
      setItems(projectNames);

      const initialCheckedItems = initialItems.reduce<{ [key: string]: boolean }>((acc, item) => {
        const projectMatch = projects_list.find((project) => project.id === item.id);
        if (projectMatch) {
          acc[projectMatch.name] = true;
        }
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
    }
  }, [projects_list, initialItems]);

  const handleCheckboxChange = (item: string) => {
    let transformedData: Project[] = [];
    setCheckedItems((prevState) => {
      const updatedCheckedItems = { ...prevState, [item]: !prevState[item] };
      transformedData = Object.keys(updatedCheckedItems)
        .filter((key) => updatedCheckedItems[key])
        .map((projectName) => {
          const project = projects_list?.find((project) => project.name === projectName);
          return project ? { id: project.id, name: projectName } : null;
        })
        .filter(Boolean) as Project[];
        return updatedCheckedItems;
      });
      handleChange(transformedData);
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
