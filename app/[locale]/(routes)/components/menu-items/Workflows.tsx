import { GitFork } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

type Props = {
  open: boolean;
  title: string;
};

const WorkflowsModuleMenu = ({ open, title }: Props) => {
  const pathname = usePathname();
  const isPath = pathname.includes("workflows");
  return (
    <div className="flex flex-row items-center mx-auto p-2">
      <Link
        href={"/workflows"}
        className={`flex gap-2 p-2 ${isPath ? "text-muted-foreground" : null}`}
      >
        <GitFork className="w-6" />
        <span className={open ? "" : "hidden"}>Workflows</span>
      </Link>
    </div>
  );
};

export default WorkflowsModuleMenu;