import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDefinitionDetail } from "@/actions/workflows/get-definition-detail";
import { format } from 'date-fns';
import Link from "next/link";
import { Heading4, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Box } from "@radix-ui/themes";

import StartNowDialog from './components/StartNowDialog';

const WorkflowDetailPage = async ({ 
  params: { definitionId },
}: {
  params: { definitionId: string };
}) => {

  const detailData = await getDefinitionDetail(definitionId);

  return (
    <Box className="p-3">
      {detailData && (
        <div className="justify-start items-start gap-y-0.5 w-full">
          <h4>Workflow Definition</h4>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">{detailData?.name}</CardTitle>
              <Badge color={detailData?.definitionStatus === 'active' ? 'success' : 'error'}>
                {detailData?.definitionStatus?.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="gap-y-0.5">
                <CardDescription>
                  {detailData?.description}
                </CardDescription>
                <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-0.5 gap-x-0.5 justify-between items-center"> 
                  <Label>Last Updated: {format(new Date(detailData?.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                  <Label>Created: {format(new Date(detailData?.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-y-0.5">
              <Link 
                  key={detailData.id}
                  href={`/workflows/edit/${detailData.id}`}
                  prefetch={false}
              >    
                <Button variant="outline">
                  Edit
                  <Pencil className="w-[15px] h-[15px] pl-2" />
                </Button>
              </Link>
              <StartNowDialog workflowDefinitionId={detailData.id} />
            </CardFooter>
          </Card>
          <h4>Workflow Runtimes</h4>
          {detailData.runtimes.map((runtime) => (
            <Link style={{ width: '100%' }} key={runtime.id} href={`/api/workflow/runtime-detail?id=${runtime.id}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{<Label>{runtime.id}</Label>}</CardTitle>
                  <Badge color={runtime.workflowStatus === 'completed' ? 'success' : undefined}>
                    label={runtime.workflowStatus.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-flow-row auto-rows-auto grid-flow auto-cols-auto gap-y-0.5 gap-x-0.5 justify-between items-center"> 
                    <Label>
                      Last Updated: {format(new Date(runtime.updatedAt as any), 'dd MMM yyyy, hh:mm aa')}
                    </Label>
                    <Label>Created: {format(new Date(runtime.createdAt as any), 'dd MMM yyyy, hh:mm aa')}</Label>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {detailData.runtimes?.length < 1 ? (
            <Label className="flex flex-row justify-center">
              No runtimes found!
            </Label>
          ) : null}
        </div>
      )}
    </Box>
  );
};

export default WorkflowDetailPage;
