"use client";

import { cn } from "@/lib/utils";
import { avatarOptions } from "@/lib/avatars";
import Image from "next/image";

interface AvatarSelectorProps {
  selectedAvatarId?: string;
  onSelect: (avatarId: string) => void;
  className?: string;
}

export default function AvatarSelector({
  selectedAvatarId,
  onSelect,
  className,
}: AvatarSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Choose an avatar
      </div>
      <div className="grid grid-cols-5 gap-3">
        {avatarOptions.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={cn(
              "relative aspect-square rounded-full overflow-hidden border-2 transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selectedAvatarId === avatar.id
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
            )}
          >
            <Image
              src={avatar.src}
              alt={avatar.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 60px, 60px"
            />
            {selectedAvatarId === avatar.id && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
