"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { visibility } from "../data/data";
import { Worksheet } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import moment from "moment";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "cardNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Card Member" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("cardNumber")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "memberName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {row.getValue("memberName")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "claimStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status Claim" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {row.getValue("claimStatus")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "limitAvailable",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Limit Available" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {row.getValue("limitAvailable")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "claimNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claim No" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {row.getValue("claimNo")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "holdingName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holding Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">
        {row.getValue("holdingName")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

