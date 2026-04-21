import React from "react";
import { cn } from "@/lib/utils";
import { Caption } from "@/design-system/atoms/Caption";

export interface KanbanItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
}

export interface KanbanColumn {
  id: string;
  label: string;
  items: KanbanItem[];
}

export interface KanbanBoardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3", className)}
      {...rest}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          className="bg-surface rounded-xl p-2.5 min-h-60"
        >
          <h4 className="text-2xs font-extrabold uppercase tracking-wide text-fg-muted px-2.5 py-1.5 flex justify-between items-center">
            {col.label}
            <span className="text-fg-muted">{col.items.length}</span>
          </h4>
          <div className="flex flex-col gap-2 mt-2">
            {col.items.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-3 text-xs cursor-grab"
              >
                <span className="block text-sm font-extrabold text-fg">
                  {item.title}
                </span>
                <Caption className="block mt-0.5">{item.subtitle}</Caption>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

KanbanBoard.displayName = "KanbanBoard";
