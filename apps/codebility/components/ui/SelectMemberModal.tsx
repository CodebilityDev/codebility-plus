"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, Users, X } from "lucide-react";
import { Codev } from "@/types/home/codev";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@codevs/ui/button";

interface SelectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (member: Codev | null) => void;
  users: Codev[];
  selectedMember: Codev | null;
  title: string;
  mode?: "single" | "optional-single"; // optional-single allows clearing selection
  excludeUserIds?: string[];
}

export const SelectMemberModal = ({
  isOpen,
  onClose,
  onSelect,
  users,
  selectedMember,
  title,
  mode = "single",
  excludeUserIds = [],
}: SelectMemberModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'smart' | 'all' | 'mentor' | 'graduated' | 'admin'>('smart');

  // Filter users based on active filter
  const filteredByStatus = useMemo(() => {
    let filtered: typeof users = [];

    switch (activeFilter) {
      case 'smart':
        // Smart filter: role_id = 5 (Mentor) OR role_id = 1 (Admin) OR internal_status = GRADUATED
        filtered = users.filter(user =>
          (user.role_id === 5 || user.role_id === 1 || user.internal_status === 'GRADUATED') &&
          !excludeUserIds.includes(user.id)
        );
        break;
      case 'mentor':
        // Mentor filter: use role_id = 5 (like landing page) instead of internal_status
        filtered = users.filter(user =>
          user.role_id === 5 &&
          !excludeUserIds.includes(user.id)
        );
        break;
      case 'graduated':
        filtered = users.filter(user =>
          user.internal_status === 'GRADUATED' &&
          !excludeUserIds.includes(user.id)
        );
        break;
      case 'admin':
        // Admin filter: use role_id = 1 instead of internal_status
        filtered = users.filter(user =>
          user.role_id === 1 &&
          !excludeUserIds.includes(user.id)
        );
        break;
      case 'all':
        filtered = users.filter(user => !excludeUserIds.includes(user.id));
        break;
    }

    return filtered;
  }, [users, activeFilter, excludeUserIds]);

  // Apply search filter
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return filteredByStatus;

    const searchLower = searchQuery.toLowerCase();
    return filteredByStatus.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const position = user.display_position?.toLowerCase() || '';
      return fullName.includes(searchLower) || position.includes(searchLower);
    });
  }, [filteredByStatus, searchQuery]);

  const handleSelect = (user: Codev) => {
    onSelect(user);
    onClose();
  };

  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  const filterCounts = useMemo(() => {
    return {
      mentor: users.filter(u => u.role_id === 5 && !excludeUserIds.includes(u.id)).length,
      graduated: users.filter(u => u.internal_status === 'GRADUATED' && !excludeUserIds.includes(u.id)).length,
      admin: users.filter(u => u.role_id === 1 && !excludeUserIds.includes(u.id)).length,
      all: users.filter(u => !excludeUserIds.includes(u.id)).length,
    };
  }, [users, excludeUserIds]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Search and Filters */}
          <div className="px-6 py-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-customBlue-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('smart')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === 'smart'
                    ? 'bg-customBlue-600 text-white ring-2 ring-customBlue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Smart Filter
              </button>
              <button
                onClick={() => setActiveFilter('mentor')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === 'mentor'
                    ? 'bg-customBlue-600 text-white ring-2 ring-customBlue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Mentors ({filterCounts.mentor})
              </button>
              <button
                onClick={() => setActiveFilter('graduated')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === 'graduated'
                    ? 'bg-customBlue-600 text-white ring-2 ring-customBlue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Graduated ({filterCounts.graduated})
              </button>
              <button
                onClick={() => setActiveFilter('admin')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === 'admin'
                    ? 'bg-customBlue-600 text-white ring-2 ring-customBlue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Admins ({filterCounts.admin})
              </button>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-customBlue-600 text-white ring-2 ring-customBlue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({filterCounts.all})
              </button>
            </div>
          </div>

          {/* Member List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {searchQuery && (
              <div className="mb-3 text-sm text-gray-500">
                Found {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
            )}

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{searchQuery ? "No members found matching your search" : "No available members"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMember?.id === user.id
                        ? 'bg-customBlue-600/20 ring-2 ring-customBlue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={user.image_url || "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.first_name} {user.last_name}
                      </div>
                      {user.display_position && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.display_position}
                        </div>
                      )}
                    </div>
                    {selectedMember?.id === user.id && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-customBlue-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex gap-3">
            {mode === 'optional-single' && selectedMember && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="flex-1"
              >
                Clear Selection
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
