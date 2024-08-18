"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import the Image component
import WorksheetModuleMenu from "./menu-items/Worksheets";
import ProjectModuleMenu from "./menu-items/Projects";
import SecondBrainModuleMenu from "./menu-items/SecondBrain";
import InvoicesModuleMenu from "./menu-items/Invoices";
import ReportsModuleMenu from "./menu-items/Reports";
import DocumentsModuleMenu from "./menu-items/Documents";
import ChatGPTModuleMenu from "./menu-items/ChatGPT";
import EmployeesModuleMenu from "./menu-items/Employees";
import WorkflowsModuleMenu from "./menu-items/Workflows";
import DataboxModuleMenu from "./menu-items/Databoxes";
import CrmModuleMenu from "./menu-items/Crm";
import StoryModuleMenu from "./Stories";
import FollowModuleMenu from "./menu-items/Follows";
import FriendModuleMenu from "./menu-items/Friends";

import AdministrationMenu from "./menu-items/Administration";
import DashboardMenu from "./menu-items/Dashboard";
import EmailsModuleMenu from "./menu-items/Emails";
import { FaBars } from "react-icons/fa";
import { cn } from "@/lib/utils";

type Props = {
  modules: any;
  dict: any;
  build: number;  
};

const ModuleMenu = ({ modules, dict, build }: Props) => {
  const [open, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }  

  return (
    <div className="flex flex-col">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        }  h-screen p-5  pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <div
            className={`cursor-pointer duration-500 border rounded-full px-4 py-2 ${
              open && "rotate-[360deg]"
            }`}
            onClick={() => setOpen(!open)}
          >
            <FaBars />
          </div>

          <div className={`flex-grow ${!open && "scale-0"}`}>
            <Image
              src="/ioh.png"
              alt="IOHub Logo"
              width={open ? 200 : 40}
              height={open ? 40 : 20}
              className="object-contain"
            />
          </div>
        </div>
        <div className="pt-6">
          <DashboardMenu open={open} title={dict.ModuleMenu.dashboard} />
          {modules.find(
            (menuItem: any) => menuItem.name === "crm" && menuItem.enabled
          ) ? (
            <CrmModuleMenu open={open} localizations={dict.ModuleMenu.crm} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "follows" && menuItem.enabled
          ) ? (
            <FollowModuleMenu open={open} title={dict.ModuleMenu.follows} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "friends" && menuItem.enabled
          ) ? (
            <FriendModuleMenu open={open} title={dict.ModuleMenu.friends} />
          ) : null}   
          {modules.find(
            (menuItem: any) => menuItem.name === "projects" && menuItem.enabled
          ) ? (
            <ProjectModuleMenu open={open} title={dict.ModuleMenu.projects} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "stories" && menuItem.enabled
          ) ? (
            <StoryModuleMenu open={open} title={dict.ModuleMenu.stories} />
          ) : null}   
          {modules.find(
            (menuItem: any) => menuItem.name === "emails" && menuItem.enabled
          ) ? (
            <EmailsModuleMenu open={open} title={dict.ModuleMenu.emails} />
          ) : null}          
          {modules.find(
            (menuItem: any) =>
              menuItem.name === "secondBrain" && menuItem.enabled
          ) ? (
            <SecondBrainModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "employee" && menuItem.enabled
          ) ? (
            <EmployeesModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "invoice" && menuItem.enabled
          ) ? (
            <InvoicesModuleMenu open={open} title={dict.ModuleMenu.invoices} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "workflows" && menuItem.enabled
          ) ? (
            <WorkflowsModuleMenu open={open} title={dict.ModuleMenu.workflows} />
          ) : null}          
          {modules.find(
            (menuItem: any) => menuItem.name === "reports" && menuItem.enabled
          ) ? (
            <ReportsModuleMenu open={open} title={dict.ModuleMenu.reports} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "documents" && menuItem.enabled
          ) ? (
            <DocumentsModuleMenu
              open={open}
              title={dict.ModuleMenu.documents}
            />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "databox" && menuItem.enabled
          ) ? (
            <DataboxModuleMenu open={open} />
          ) : null}
          {modules.find(
            (menuItem: any) => menuItem.name === "openai" && menuItem.enabled
          ) ? (
            <ChatGPTModuleMenu open={open} />
          ) : null}
          {/* <AdministrationMenu open={open} title={dict.ModuleMenu.settings} /> */}
        </div>
      </div>
      <div
        className={cn("flex justify-center items-center w-full", {
          hidden: !open,
        })}
      >
        <span className="text-xs text-gray-500 pb-2">
          build: 0.0.3-beta-{build}
        </span>
      </div>      
    </div>
  );
};

export default ModuleMenu;
