import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/design-system/atoms/Avatar";
import { Caption } from "@/design-system/atoms/Caption";

export interface UserProfileSnippetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarInitials?: string;
}

export const UserProfileSnippet: React.FC<UserProfileSnippetProps> = ({
  name,
  role,
  avatarSrc,
  avatarInitials,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl",
        className
      )}
      {...rest}
    >
      <Avatar
        src={avatarSrc}
        initials={avatarInitials || name.slice(0, 2).toUpperCase()}
        size="md"
      />
      <div className="min-w-0">
        <span className="block text-[0.8125rem] font-bold text-[var(--fg)] truncate">
          {name}
        </span>
        <Caption className="block truncate">{role}</Caption>
      </div>
    </div>
  );
};

UserProfileSnippet.displayName = "UserProfileSnippet";
