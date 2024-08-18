"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from '@radix-ui/themes';
import Link from 'next/link';
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { GitFork } from "lucide-react";

const WorkflowListView = ({ data }: any) => {
  const [isLoading] = useState(false);
  
  return (
    <Box>
      <div className="gap-y-1">
        <div className="flex flex-row justify-end items-center">
          <Link href={`/workflows/create`}>
            <Button className="mb-5">
              Create&nbsp; +
            </Button>
          </Link>
        </div>
        {!isLoading && data && (
          <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
            {data.map((item: any) => (
              <Link className="w-full"
                key={item.id}
                href={`/workflows/detail/${item.id}`}
              >
                <Card className="rounded-lg border bg-card text-card-foreground shadow-md hover:bg-slate-100">
                  <CardContent className="grid gap-4">
                    <div className="md:grid lg:grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="text-xl mt-2 font-medium flex flex-row gap-2 p-2"><GitFork className="text-xl pt-1" />{item.name}</div>
                      <div className="flex flex-row justify-end h-8 mt-3">
                        { item.definitionStatus === 'active' ?  
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-1.5 rounded dark:bg-green-900 dark:text-green-300">{item.definitionStatus}</span> :
                          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-1.5 rounded dark:bg-red-900 dark:text-red-300">{item.definitionStatus}</span>
                        }
                      </div>                       
                    </div>
                    <Separator />
                    <span className="font-normal">Description:</span><span className="font-normal ml-1 w-full">{item.description}</span>
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>
                        <span className="font-light">Created at:</span><span className="font-normal pl-1">{format(new Date(item.createdAt), 'dd MMM, yyyy')}</span>
                      </span>
                      <span>
                      <span className="font-light">Updated at:</span><span className="font-normal pl-1">{format(new Date(item.updatedAt), 'dd MMM, yyyy')}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {data?.length < 1 ? (
              <span className="flex flex-row justify-center">
                No workflow definitions found!
              </span>
            ) : null}
          </div>
        )}
        {isLoading && (
          <div className="justify-start items-start gap-y-0.5">
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row justify-between iteeems-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
                </div>
              </CardContent>
            </Card>
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row juuustify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div  className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
                </div>
              </CardContent>
            </Card>
            <Card className="w-full hover:bg-slate-100">
              <CardContent>
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="h-[30px] w-[75px]" />
                </div>
                <Skeleton />
                <div className="w-full flex flex-row justify-between items-center">
                  <Skeleton className="w-[100px]" />
                  <Skeleton className="w-[100px]" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Box>
  );
};

export default WorkflowListView;
