import { getUsers } from "@/actions/get-users";
import React from "react";
import Container from "../../components/ui/Container";
import { InviteForm } from "./components/InviteForm";
import { Separator } from "@/components/ui/separator";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminUserDataTable } from "./table-components/data-table";
import { columns } from "./table-components/columns";
import { User } from "@/interfaces/user";
import { Button } from "@/components/ui/button";
import SendMailToAll from "./components/send-mail-to-all";

const AdminUsersPage = async () => {
  const users: User[] = await getUsers();

  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return (
      <Container
        title="Administration"
        description="You are not admin, access not allowed"
      >
        <div className="flex w-full h-full items-center justify-center">
          Access not allowed
        </div>
      </Container>
    );
  }

  return (
    <Container
      title="Users administration"
      description={"Here you can manage your SaasHQ users"}
    >
      <div className="flex-col1">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Invite new user to SaasHQ
        </h4>
        <InviteForm />
      </div>
      <Separator />
      <div>
        <SendMailToAll />
      </div>
      <Separator />
      
      <AdminUserDataTable columns={columns} data={users} />
    </Container>
  );
};

export default AdminUsersPage;
