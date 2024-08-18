"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';

import { Sigma } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { FunctionConfigSchema } from './Config/page';
import FunctionConfigPanel from './Config/page';

interface DataProp {
  label: string;
  inputBoundId: string;
  outputBoundId: string;
  params: Record<string, any>;
  exec: string;
  execTs: string;
}

const FunctionTask: FC<NodeProps<DataProp>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [id, setNodes]);

  const changeValues = useCallback(
    (value: FunctionConfigSchema) => {
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
                <Sigma width="15" height="15" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  {['ID', id].join(' : ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>          
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          {'Function'}
        </CardDescription>  
      </CardHeader>
      <CardFooter>
        <FunctionConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardFooter>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default FunctionTask;
