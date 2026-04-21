import React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/design-system/atoms/SearchInput";
import { IconButton } from "@/design-system/atoms/IconButton";

export interface SearchBarProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  defaultValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search jobs, companies...",
  onSearch,
  defaultValue = "",
  className,
  ...rest
}) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2", className)}
      {...rest}
    >
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <IconButton
        type="submit"
        icon="Search"
        iconSize={18}
        aria-label="Search"
      />
    </form>
  );
};

SearchBar.displayName = "SearchBar";
