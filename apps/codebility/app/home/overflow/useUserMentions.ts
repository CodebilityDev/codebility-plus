// hooks/useUserMentions.ts
import { useState, useCallback, useEffect } from 'react';
import { createClientServerComponent } from '@/utils/supabase/server';

export interface MentionUser {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  username?: string;
}

export function useUserMentions() {
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = useCallback(async (query: string): Promise<MentionUser[]> => {
    if (!query.trim()) return [];

    setIsLoading(true);
    try {
      const supabase = await createClientServerComponent();
      
      const { data, error } = await supabase
        .from('codev')
        .select('id, first_name, last_name, image_url, username')
        .or(
          `first_name.ilike.%${query}%,last_name.ilike.%${query}%,username.ilike.%${query}%`
        )
        .limit(10);

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return (data as MentionUser[]) || [];
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { searchUsers, isLoading, users };
}