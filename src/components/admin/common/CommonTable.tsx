import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface CommonTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  striped?: boolean;
  withBorder?: boolean;
  expandableRow?: (row: TData) => React.ReactNode;
}

export default function CommonTable<TData>({
  data,
  columns,
  striped = true,
  withBorder = true,
  expandableRow,
}: CommonTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={`overflow-x-auto rounded-lg shadow-lg ${
        withBorder ? "border border-gray-200" : ""
      }`}
    >
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, rowIndex) => (
            <React.Fragment key={row.id}>
              <tr
                className={`${
                  striped
                    ? rowIndex % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                    : "bg-white"
                } hover:bg-indigo-50 transition-colors duration-200`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-3 text-gray-700 text-sm border-t"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>

              {expandableRow && (
                <tr>
                  <td colSpan={row.getVisibleCells().length}>
                    {expandableRow(row.original)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
