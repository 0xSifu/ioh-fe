"use client";

import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "itemName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SUB BENEFIT NAME" />
    ),
    cell: ({ row }) => (
      <div className="w-[700px]">
        {row.getValue("itemName")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "innerLimitAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inner Limit" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("innerLimitAmount")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "innerLimitQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QTY" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<number>(row.getValue("innerLimitQty") || 0);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
        // Optionally update the row data here
      };

      return (
        <div className="w-[150px]">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "satuan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SATUAN" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<string>(row.getValue("satuan") || '');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        // Optionally update the row data here
      };

      return (
        <div className="w-[200px]">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "satuanIDR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SATUAN (IDR)" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("satuanIDR")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalClaim",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TOTAL CLAIM" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("totalClaim")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "prorata",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRORATA" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("prorata")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "exclusion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EXCLUSION" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<string>(row.getValue("exclusion") || '');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        // Optionally update the row data here
      };

      return (
        <div className="w-[200px]">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "exclusionIDR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EXCLUSION (IDR)" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("exclusionIDR")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "coverIDR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="COVER (IDR)" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("coverIDR")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "excessIDR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EXCESS (IDR)" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("excessIDR")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "remark",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="REMARK" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<string>(row.getValue("remark") || '');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        // Optionally update the row data here
      };

      return (
        <div className="w-[200px]">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "modifiedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MODIFIED BY" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("modifiedBy")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "modifiedTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MODIFIED TIME" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("modifiedTime")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  }
];

