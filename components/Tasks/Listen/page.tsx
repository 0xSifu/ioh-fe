"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { ListenConfigSchema } from './Config/ListenConfigPanel';
import ListenConfigPanel from './Config/ListenConfigPanel';
import { Webhook } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";

interface DataProps {
  label: string;
  params: { apiKey: string };
  inputBoundId: string;
  outputBoundId: string;
}

const ListenTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [id, setNodes]);

  const changeValues = useCallback(
    (value: ListenConfigSchema) => {
      const currentNode = getNode(id);
      if (currentNode) {
        const newData = {
          ...currentNode.data,
          ...value,
        };
        setNodes((nodes) =>
          nodes.map((curNode) =>
            curNode.id == id
              ? {
                  ...curNode,
                  data: newData,
                }
              : curNode
          )
        );
      }
    },
    [getNode, id, setNodes]
  );

  return (
    <Card className="shadow-md">
      <Handle type="target" position={Position.Top} id={data?.inputBoundId} />
      <CardHeader>
        <CardTitle className="flex gap-2">
          {data.label}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Webhook width="15" height="15" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  {['ID', id].join(' : ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>          
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          {'Listen'}
        </CardDescription>  
      </CardHeader>
      <CardFooter>
        <ListenConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardFooter>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default ListenTask;
