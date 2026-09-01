"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClientClientComponent } from "@/utils/supabase/client";
import { 
  TechnicalLeader, 
  SoftSkillsLeader, 
  ProjectLeader, 
  LeaderboardType, 
  TimePeriod,
  LeaderboardError,
  LeaderboardState
} from "@/types/leaderboard";

interface UseLeaderboardOptions {
  type: LeaderboardType;
  category?: string;
  timePeriod?: TimePeriod;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseLeaderboardReturn {
  data: (TechnicalLeader | SoftSkillsLeader | ProjectLeader)[];
  categories: string[];
  state: LeaderboardState;
  refetch: () => Promise<void>;
  setCategory: (category: string) => void;
  setTimePeriod: (period: TimePeriod) => void;
}

export const useLeaderboard = (options: UseLeaderboardOptions): UseLeaderboardReturn => {
  const {
    type,
    category = "",
    timePeriod = "all",
    limit = 10,
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [data, setData] = useState<(TechnicalLeader | SoftSkillsLeader | ProjectLeader)[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriod);
  const [state, setState] = useState<LeaderboardState>({
    isLoading: true,
    error: null
  });

  const createError = useCallback((message: string, details?: string, code?: string): LeaderboardError => ({
    message,
    details,
    code
  }), []);

  const fetchCategories = useCallback(async () => {
    if (type !== "technical") return;
    
    let isMounted = true;
    
    try {
      const supabase = createClientClientComponent();
      const { data: categoriesData, error } = await supabase
        .from("skill_category")
        .select("name")
        .order("name");

      if (!isMounted) return;

      if (error) {
        setState(prev => ({
          ...prev,
          error: createError("Failed to load skill categories", error.message, error.code)
        }));
        return;
      }

      const categoryNames = categoriesData
        .map((cat: { name: string }) => cat.name)
        .filter(name => name !== "Project Manager");

      // Reorder to put Frontend Developer first
      const reorderedCategories = [...categoryNames];
      const frontendIndex = reorderedCategories.findIndex(cat => cat === "Frontend Developer");
      if (frontendIndex !== -1) {
        const [frontendDev] = reorderedCategories.splice(frontendIndex, 1);
        reorderedCategories.unshift(frontendDev);
      }

      setCategories(reorderedCategories);
      if (!selectedCategory && reorderedCategories.length > 0) {
        setSelectedCategory(reorderedCategories[0]);
      }
    } catch (error) {
      if (isMounted) {
        setState(prev => ({
          ...prev,
          error: createError("Network error while fetching categories", error instanceof Error ? error.message : "Unknown error")
        }));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [type, selectedCategory, createError]);

  const fetchTechnicalLeaderboard = useCallback(async (): Promise<TechnicalLeader[]> => {
    if (!selectedCategory) return [];

    const response = await fetch(`/api/technical-leaderboard?category=${encodeURIComponent(selectedCategory)}&timeFilter=${selectedTimePeriod}&limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError(
        errorData.error || "Failed to fetch technical leaderboard",
        errorData.details,
        response.status.toString()
      );
    }

    const result = await response.json();
    return result.leaders || [];
  }, [selectedCategory, selectedTimePeriod, limit, createError]);

  const fetchSoftSkillsLeaderboard = useCallback(async (): Promise<SoftSkillsLeader[]> => {
    const response = await fetch(`/api/soft-skills-leaderboard?limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError(
        errorData.error || "Failed to fetch soft skills leaderboard",
        errorData.details,
        response.status.toString()
      );
    }

    const result = await response.json();
    return result.leaders || [];
  }, [limit, createError]);

  const fetchProjectLeaderboard = useCallback(async (): Promise<ProjectLeader[]> => {
    const response = await fetch(`/api/project-leaderboard?timeFilter=${selectedTimePeriod}&limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError(
        errorData.error || "Failed to fetch project leaderboard", 
        errorData.details,
        response.status.toString()
      );
    }

    const result = await response.json();
    return result.leaders || [];
  }, [selectedTimePeriod, limit, createError]);

  const fetchData = useCallback(async () => {
    let isMounted = true;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      let leaderboardData: (TechnicalLeader | SoftSkillsLeader | ProjectLeader)[] = [];

      switch (type) {
        case "technical":
          leaderboardData = await fetchTechnicalLeaderboard();
          break;
        case "soft-skills":
          leaderboardData = await fetchSoftSkillsLeaderboard();
          break;
        case "projects":
          leaderboardData = await fetchProjectLeaderboard();
          break;
      }

      if (isMounted) {
        setData(leaderboardData);
        setState({
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      if (isMounted) {
        setState({
          isLoading: false,
          error: error as LeaderboardError,
          lastUpdated: new Date()
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [type, fetchTechnicalLeaderboard, fetchSoftSkillsLeaderboard, fetchProjectLeaderboard]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const setCategory = useCallback((newCategory: string) => {
    setSelectedCategory(newCategory);
  }, []);

  const setTimePeriod = useCallback((period: TimePeriod) => {
    setSelectedTimePeriod(period);
  }, []);

  // Initial data fetching
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (type === "technical" && !selectedCategory) return;
    fetchData();
  }, [type, selectedCategory, selectedTimePeriod, fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (!state.isLoading) {
        fetchData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, state.isLoading, fetchData]);

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    data,
    categories,
    state,
    refetch,
    setCategory,
    setTimePeriod
  }), [data, categories, state, refetch, setCategory, setTimePeriod]);

  return returnValue;
};