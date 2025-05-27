"use client";

import { useEffect, useState } from "react";
import { createClientClientComponent } from "@/utils/supabase/client";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@codevs/ui/button";
import { Checkbox } from "@codevs/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@codevs/ui/popover";

interface Position {
  id: string;
  name: string;
}

interface PositionSelectProps {
  id: string;
  error?: string;
}

export function PositionMultiselectField({ id, error }: PositionSelectProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setValue } = useFormContext();

  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!selectedPositions) return;
    setValue(id, selectedPositions, {
      shouldValidate: false,
    });
  }, [selectedPositions]);

  useEffect(() => {
    if (!supabase) return;
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from("positions")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setPositions(data || []);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [supabase]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`md:text-md bg-dark-200 text-grey-100 flex justify-between border-b-2 p-2 text-sm font-normal focus:outline-none lg:text-lg ${
            error ? "border-red-400" : "border-darkgray"
          }`}
        >
          {selectedPositions.length > 0
            ? `${selectedPositions.length} position${selectedPositions.length > 1 ? "s" : ""} selected`
            : "Select applicable positions"}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-dark-200 border-darkgray flex max-h-[300px] flex-col overflow-y-auto p-0 text-white">
        {isLoading ? (
          <div className="flex items-center px-3 py-5 ">
            Loading positions...
          </div>
        ) : (
          positions.map((position, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-500"
            >
              <Checkbox
                className="border-white"
                value={position.name}
                checked={selectedPositions.includes(position)}
                onCheckedChange={(checked) => {
                  setSelectedPositions((prev) =>
                    checked
                      ? [...prev, position]
                      : prev.filter((item) => item !== position),
                  );
                }}
              />
              <label>{position.name}</label>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
