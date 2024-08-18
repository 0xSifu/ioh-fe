import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { getSession } from "next-auth/react";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { visibility } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { listMember } from "@/lib/list-member";
import Spinner from "@/components/Spinner"; // Import your Spinner component

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  setData: (data: TData[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  setData,
}: DataTableToolbarProps<TData>) {
  const [claimNumber, setClaimNumber] = useState("");
  const [statusClaim, setStatusClaim] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleFilterChange = async () => {
    try {
      setLoading(true); // Set loading to true
      const session = await getSession();
      if (!session) {
        throw new Error("No session found");
      }
      const email = session.user.email;
      const token = session.user.accessToken;
      const data = await listMember(email, token || '', claimNumber, statusClaim);
      console.log("Filtered Data: ", data);
      
      setData(data?.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Claim Number..."
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder="Status Claim..."
          value={statusClaim}
          onChange={(e) => setStatusClaim(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button variant="ghost" onClick={handleFilterChange} className="h-8">
          Apply Filters
        </Button>
        {loading && <Spinner />}
        {table.getColumn("visibility") && (
          <DataTableFacetedFilter
            column={table.getColumn("visibility")}
            title="Visibility"
            options={visibility}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
