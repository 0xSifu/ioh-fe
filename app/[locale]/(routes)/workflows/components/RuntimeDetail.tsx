"use client";

import { getRuntimeDetail } from '@/actions/workflows/get-runtime-detail';
import { Heading4, Heading5, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { FC } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Label } from '@/components/ui/label';

interface Props {}

const RuntimeDetailPage: FC<Props> = () => {
  const params = useParams<{ id: string }>();

  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [params?.id],
    queryFn: async () => {
      if (params?.id) {
        return getRuntimeDetail(params.id);
      }
      return null;
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Box className="p-3">
      {isLoading && <Label>Loading...</Label>}
      {!isLoading && data && (
        <div className="justify-start items-start gap-y-1 w-full">
          <Heading4>Workflow Definition</Heading4>
          <Link className="w-full"
            href={`/workflows/${data.definitions.id}`}
          >  
            <Card className="w-full hover:bg-slate-100 border-slate-200">
              <CardHeader>
                <CardTitle>
                  {<Heading4>{data.definitions.name}</Heading4>}
                  <Badge color={data.definitions.definitionStatus === 'active' ? 'success' : 'error'}>
                    <Label>{data.definitions?.definitionStatus?.toUpperCase()}</Label>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="gap-y-0.5">
                  <CardDescription>
                    {data?.definitions?.description}
                  </CardDescription>
                  <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-0.5 gap-x-0.5 justify-between items-center"> 
                    <Label>
                      Last Updated: {format(new Date(data?.definitions?.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}
                    </Label>
                    <Label>
                      Created: {format(new Date(data?.definitions?.createdAt as any), 'dd MMM yyyy, hh:mm aa')}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-1 gap-x-0.5 justify-between items-center w-full"> 
            <Heading5>Runtime</Heading5>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>                
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>  
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full gap-y-0.5">
            <Card className="border-[1px] border-slate-200 w-full">
              <CardHeader>
                <CardTitle>
                  {<Label>{data.id}</Label>}
                  <Badge color={data.workflowStatus === 'completed' ? 'success' : undefined}>
                    label={data.workflowStatus.toUpperCase()}
                  </Badge>          
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="gap-y-0.5">
                  <Label>Last Updated: {format(new Date(data?.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                  <Label>Created: {format(new Date(data?.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                </div>
              </CardContent>
            </Card>
            <Heading5>Tasks</Heading5>
            <div className="flex flex-row w-full border-[1px] border-slate-200 p-2 justify-start items-start gap-y-0.5 gap-x-0.5">
              {data.tasks.map((task) => (
                <Card className="border-[1px] border-slate-100" key={task.id}>
                  <CardHeader>
                    <CardTitle>{task.name}</CardTitle>
                    {<Badge color="primary">{task.type.toUpperCase()}</Badge>}
                  </CardHeader>
                  <CardContent>
                    <div className="justify-start items-start gap-y-2">
                      <div className="flex flex-row justify-start items-center gap-x-0.5">
                        <Label>Status</Label>
                        <Badge color={task?.status === 'completed' ? 'success' : undefined}>
                          {task.status.toUpperCase()}
                        </Badge>
                      </div>
                      {data?.workflowResults?.[task.name] && (
                        <TooltipProvider>
                          <Tooltip>
                            <Button
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard
                                .writeText(JSON.stringify(data?.workflowResults?.[task.name], undefined, 4))
                                .then(() => {
                                  toast({
                                    title: "Success",
                                    description: "Results copied to Clipboard",
                                  });
                                })
                                .catch();
                              }}
                            >
                              Copy Result
                            </Button>
                            <TooltipContent>
                              {JSON.stringify(data?.workflowResults, undefined, 4)}
                            </TooltipContent>  
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Heading5>Logs</Heading5>
            <div className="w-full border-[1px] border-slate-200 justify-start items-start overflow-x-auto overflow-y-auto max-h-[500px]">
              {data.logs.map(({ log, timestamp, severity, taskName }) => (
                <div className="flex flex-row justify-start items-center gap-x-0.5 w-full py-2 px-2 border-[1px] border-slate-200" key={timestamp as any}>
                  <Badge>{severity}</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent> 
                        {format(new Date(timestamp as any), 'dd MMM yyyy, hh:mm aa')}
                        <Badge>{timestamp as any}</Badge>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Label className="font-semibold">
                    {taskName}
                  </Label>
                  <Label className="flex-1 text-slate-800 w-full">
                    {log}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default RuntimeDetailPage;
