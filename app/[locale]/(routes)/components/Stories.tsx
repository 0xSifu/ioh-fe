import { ClipboardPenLine } from "lucide-react";
import { Mail } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  open: boolean;
  title: string;  
};

const StoryModuleMenu = ({ open, title }: Props) => {
  const pathname = usePathname();
  const isPath = pathname.includes("stories");

  return (
    <div className="flex flex-row items-center mx-auto p-2">
      <Link
        href={"/stories"}
        className={`flex gap-2 p-2 ${isPath ? "text-muted-foreground" : null}`}
      >
        <ClipboardPenLine className="w-6" />
        <span className={open ? "" : "hidden"}>{title}</span>
      </Link>
    </div>
  );
};

export default StoryModuleMenu;