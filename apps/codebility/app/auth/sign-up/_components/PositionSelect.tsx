"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { createClientClientComponent } from "@/utils/supabase/client";

interface Position {
  id: string;
  name: string;
}

interface PositionSelectProps {
  onChange: (value: string) => void;
  value?: string;
  error?: string;
}

export const PositionSelect = ({
  onChange,
  value,
  error,
}: PositionSelectProps) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

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
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger
        className={`md:text-md bg-dark-200 placeholder:text-gray border-b-2 p-2 text-sm text-white focus:outline-none lg:text-lg ${
          error ? "border-red-400" : "border-darkgray"
        }`}
      >
        <SelectValue placeholder="Select your position" />
      </SelectTrigger>
      <SelectContent className="bg-dark-200 border-darkgray max-h-[300px] overflow-y-auto">
        <SelectGroup>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading positions...
            </SelectItem>
          ) : positions.length > 0 ? (
            positions.map((position) => (
              <SelectItem
                key={position.id}
                value={position.name}
                className="hover:bg-dark-300 focus:bg-dark-300 text-white"
              >
                {position.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-positions" disabled>
              No positions available
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PositionSelect;
