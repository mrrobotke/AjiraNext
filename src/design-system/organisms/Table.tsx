import React from "react";
import { cn } from "@/lib/utils";

export interface TableColumn {
  key: string;
  header: string;
}

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement> {
  columns: TableColumn[];
  data: Record<string, React.ReactNode>[];
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  className,
  ...rest
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...rest}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-2xs font-extrabold uppercase tracking-wide text-fg-muted px-3.5 py-3 border-b border-border"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-b-0 hover:bg-surface transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3.5 py-3.5 text-fg font-medium"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = "Table";
