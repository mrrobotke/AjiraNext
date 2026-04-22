import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/design-system/atoms/Label";
import { Caption } from "@/design-system/atoms/Caption";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  inputId?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  inputId,
  error,
  hint,
  children,
  className,
  ...rest
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...rest}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {children}
      {error && <Caption variant="error">{error}</Caption>}
      {hint && !error && <Caption>{hint}</Caption>}
    </div>
  );
};

FormField.displayName = "FormField";
