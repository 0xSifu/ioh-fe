"use client";

import 'reactflow/dist/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Box } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { 
  ChevronDown,
  Sigma,
  PlayCircle,
  CircleOff,
  ShieldCheck, 
  Hand,
  Webhook,
  Cog
} from "lucide-react";
import type { MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Connection, Edge } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { z } from 'zod';
import { useToast } from "@/components/ui/use-toast";
import { useWorkflowDefinitionContext } from '@/app/contexts/WorkflowDefinitionContext';
import { useRouter } from 'next/navigation';
import { nodeTypes, taskCreator } from '@/lib/creators/task';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import WorkflowGlobalMonaco from '../../../components/WorkflowGlobalMonaco';
import { Separator } from '@/components/ui/separator';
import { ResponseSchemaType } from '@/actions/workflows/get-definition-single';

const workflowMetadataFormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Name is required'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, 'Description is required'),
  global: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
  status: z.enum(['active', 'inactive']),
});

type WorkflowMetadataFormSchema = z.infer<typeof workflowMetadataFormSchema>;

interface EditFormProps {
  editData: ResponseSchemaType;
}

export function WorkflowEditPage({ editData }: EditFormProps) {
  const [isLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const { setConfig } = useWorkflowDefinitionContext();

  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuEl);

  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [nodes, _, onNodesChange] = useNodesState(editData.uiObject.react.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(editData.uiObject.react.edges);
  const { addNodes } = useReactFlow();

  const [definitionDialog, setDefinitionDialog] = useState<boolean>(false);

  const [globalEditorError, setGlobalEditorError] = useState<string | null>(null);

  const { setValue, watch, handleSubmit } = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
    mode: 'all',
    values: {
      name: editData.name,
      description: editData.description,
      global: editData?.global ?? {},
      status: editData.definitionStatus,
    },
  });

  const globalObjectValue = watch('global');

  const form = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
    mode: 'all',
    values: {
      name: editData.name,
      description: editData.description,
      global: editData?.global ?? {},
      status: editData.definitionStatus,
    },    
  });

  useEffect(() => {
    setConfig(globalObjectValue);
  }, [globalObjectValue, setConfig]);

  const handleGlobalEditorError = (error: string | null) => {
    setGlobalEditorError(() => error);
  };

  const definitionStatus = [
    { name: "Active", id: "Active" },
    { name: "Inactive", id: "Inactive" },
  ];   

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const deleteEdge = useCallback(
    (edge: Edge) => {
      setEdges((edges) => edges.filter((curEdge) => curEdge.id !== edge.id));
    },
    [setEdges]
  );

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuEl(() => event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuEl(() => null);
  };

  const openDefinitionDialog = () => {
    setDefinitionDialog(() => true);
  };

  const closeDefinitionDialog = () => {
    setDefinitionDialog(() => false);
  };  

  const addNewTask = (type: keyof typeof taskCreator) => {
    addNodes(taskCreator[type]());
    handleMenuClose();
  };

  const submitHandle = handleSubmit(async (values) => {
    setFormLoading(() => true);

    const parsedTask = nodes.map((item) => ({
      id: item?.id,
      name: item.data?.label,
      type: item.type?.toUpperCase(),
      params: item?.data?.params ?? {},
      next: edges
        .filter((val) => val?.sourceHandle === item?.data?.outputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.target)?.data?.label)
        .filter((v) => !!v),
      previous: edges
        .filter((val) => val?.targetHandle === item?.data?.inputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.source)?.data?.label)
        .filter((v) => !!v),
      ...(item?.data?.exec && {
        exec: item?.data?.exec,
      }),
      ...(item?.data?.execTs && {
        execTs: item?.data?.execTs,
      }),
    }));

    const workflowData = {
      name: values.name,
      description: values.description,
      global: values.global,
      tasks: parsedTask,
      status: values.status,
    };

    await axios
      .put(
        `/api/definition/${editData.id}`,
        {
          workflowData,
          key: 'react',
          ui: {
            nodes,
            edges,
          }
        },
      )
      .then(() => {
        toast({
          title: "Success",
          description: "Workflow updated successfully."
        });
        router.push(`/workflows/${editData.id}`);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Workflow update failed."
        });
      })
      .finally(() => {
        setFormLoading(() => false);
      });
  });

  return (
    <Box>
      <div className="w-full h-[80vh] justify-start items-start gap-y-1">
        <div className="flex flex-row justify-between items-center gap-x-0.5 w-full">
          <div className="flex flex-row justify-start items-center gap-x-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandle as any)}>             
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="relative" onClick={openDefinitionDialog}>Configure Definition&nbsp; <Cog className="w-[15px] h-[15px]" />
                      <span>
                        {Object.keys(form?.formState.errors).length > 0 ? (
                          <span className="absolute bg-red-500 text-red-100 px-2 py-1 text-xs font-bold rounded-full -top-2 -right-2">
                            {Object.keys(form?.formState.errors).length}
                          </span>  
                        ) : null}
                      </span>                  
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-[540px]" onClose={() => closeDefinitionDialog}>
                    <SheetHeader>
                      <SheetTitle>Create Definition</SheetTitle>
                      <SheetDescription>
                        Make changes to your workflow definition here. Your work remains intact when this panel is closed.
                      </SheetDescription>
                    </SheetHeader>
                    <Separator className="mt-6" />
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2 w-full">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  placeholder="Definition name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  disabled={isLoading}
                                  placeholder="Definition description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="SelectTrigger">
                                    <SelectValue placeholder="Choose definition status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="flex overflow-y-auto">
                                  {definitionStatus.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                      {status.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-1/2 space-y-5">
                        <FormLabel>Global Editor</FormLabel>
                        {globalEditorError && (
                          <div className="flex gap-2">
                            <FormLabel className="text-red-600">{globalEditorError}</FormLabel>
                          </div>
                        )}
                        <WorkflowGlobalMonaco
                          initialValue={JSON.stringify(globalObjectValue, undefined, 4)}
                          setValue={setValue}
                          setError={handleGlobalEditorError}
                        />
                      </div>
                    </div>  
                  </SheetContent>
                </Sheet>
                <Button type="submit" className="absolute right-10 mr-10">
                  Submit
                </Button>                    
              </form>
            </Form>     
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary" onClick={handleMenuOpen}>
                  New Task&nbsp;
                  <ChevronDown width="16" height="16" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[125px]">              
                <DropdownMenuItem onClick={() => addNewTask('function')}>
                  <Sigma width="18" height="18" />
                  <span className="pl-4"> Function </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('start')}>
                  <PlayCircle width="18" height="18" />
                  <span className="pl-4"> Start </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('end')}>
                  <CircleOff width="18" height="18" />
                  <span className="pl-4"> End </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('guard')}>
                  <ShieldCheck width="18" height="18" />
                  <span className="pl-4"> Guard </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('wait')}>
                  <Hand width="18" height="18" />
                  <span className="pl-4"> Wait </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewTask('listen')}>
                  <Webhook width="18" height="18" />
                  <span className="pl-4"> Listen </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onEdgeDoubleClick={(e, edge) => {
            e.preventDefault();
            e.stopPropagation();
            deleteEdge(edge);
          }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default WorkflowEditPage;
