// components/MentionPopover.tsx
"use client";

import { memo, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import DefaultAvatar from '@/components/DefaultAvatar';
import { Button } from '@/components/ui/button';
import type { MentionUser } from '../useUserMentions';

interface MentionPopoverProps {
  isOpen: boolean;
  users: MentionUser[];
  isLoading: boolean;
  position: { top: number; left: number };
  onSelectUser: (user: MentionUser) => void;
  onClose: () => void;
}

const MentionUserItem = memo(function MentionUserItem({
  user,
  onSelect,
}: {
  user: MentionUser;
  onSelect: (user: MentionUser) => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect(user)}
      className="w-full justify-start gap-2 px-3 py-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {user.image_url ? (
          <Image
            src={user.image_url}
            alt={`${user.first_name} ${user.last_name}`}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <DefaultAvatar size={32} />
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.first_name} {user.last_name}
        </div>
        {user.username && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @{user.username}
          </div>
        )}
      </div>
    </Button>
  );
});

export const MentionPopover = memo(function MentionPopover({
  isOpen,
  users,
  isLoading,
  position,
  onSelectUser,
  onClose,
}: MentionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {users.map((user) => (
            <MentionUserItem
              key={user.id}
              user={user}
              onSelect={onSelectUser}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
});