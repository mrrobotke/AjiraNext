import React from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/design-system/molecules/FormField";
import { TextInput } from "@/design-system/atoms/TextInput";
import { Select } from "@/design-system/atoms/Select";
import { Checkbox } from "@/design-system/atoms/Checkbox";
import { Button } from "@/design-system/atoms/Button";

export interface FilterPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onApply?: () => void;
  onReset?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onApply,
  onReset,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-6 flex flex-col gap-4",
        className
      )}
      {...rest}
    >
      <FormField label="Keyword">
        <TextInput placeholder="e.g. Product Manager" />
      </FormField>
      <FormField label="Location">
        <Select>
          <option>Any location</option>
          <option>Nairobi</option>
          <option>Lagos</option>
          <option>Remote</option>
          <option>Johannesburg</option>
        </Select>
      </FormField>
      <FormField label="Job Type">
        <Select>
          <option>Any type</option>
          <option>Full-time</option>
          <option>Contract</option>
          <option>Part-time</option>
        </Select>
      </FormField>
      <FormField label="Experience">
        <Select>
          <option>Any level</option>
          <option>Junior</option>
          <option>Mid</option>
          <option>Senior</option>
          <option>Lead</option>
        </Select>
      </FormField>
      <div className="flex flex-col gap-2 pt-2">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <Checkbox />
          <span className="text-sm text-fg">Remote only</span>
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <Checkbox />
          <span className="text-sm text-fg">
            Verified employers
          </span>
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={onApply}>
          Apply Filters
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

FilterPanel.displayName = "FilterPanel";
