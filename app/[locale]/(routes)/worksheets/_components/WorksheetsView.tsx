import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorksheetsDataTable } from "../table-components/data-table";
import { columns } from "../table-components/columns";
import { listMember } from "@/lib/list-member";

const WorksheetsView = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;
  const token = session?.user?.accessToken;
  const email = session?.user?.email;
  const claimNumber = '';
  const statusClaim = '';
  const list: any = await listMember(email, token || '', claimNumber, statusClaim);
  
  return (
    <>
      <div className="pt-2 space-y-3">
        <WorksheetsDataTable initialData={list?.data} columns={columns} />
      </div>
    </>
  );
};

export default WorksheetsView;
