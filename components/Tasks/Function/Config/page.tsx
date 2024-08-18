"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import ParamsMonaco from './ParamsMonaco/ParamsMonaco';
import ExecMonaco from './ExecMonaco/ExecMonaco';
import { useReactFlow } from 'reactflow';
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const functionConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
  params: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
  exec: z
    .string({
      required_error: 'Function code is required',
    })
    .min(1, 'Function code is required'),
  execTs: z
    .string({
      required_error: 'Function code typescript is required',
    })
    .min(1, 'Function code typescript is required'),
});

export type FunctionConfigSchema = z.infer<typeof functionConfigSchema>;

interface Props {
  onSubmit: (value: FunctionConfigSchema) => void;
  initialValue: FunctionConfigSchema;
  deleteNode: Function;
  id: string;
}

const FunctionConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const [isLoading] = useState<boolean>(false);
  const { toast } = useToast()

  const [ openConfigPanel, setOpenConfigPanel ] = useState<boolean>(false);  
  const { getNodes } = useReactFlow();
  const [paramsEditorError, setParamsEditorError] = useState<string | null>(null);
  const [execEditorError, setExecEditorError] = useState<string | null>(null);
  const [labelUniqueError, setLabelUniqueError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const { handleSubmit, watch, setValue } = useForm<FunctionConfigSchema>({
    resolver: zodResolver(functionConfigSchema),
    values: {
      label: initialValue?.label ?? '',
      params: initialValue?.params ?? {},
      exec: initialValue?.exec ?? '',
      execTs:
        initialValue?.execTs ??
        `
/**
 * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
*/
async function handler(){
  return {};
}
      `,
    },
  });
  const labelValue = watch('label');
  const paramsObjectValue = watch('params');
  const execObjectValue = watch('execTs');

  const form = useForm<FunctionConfigSchema>({
    resolver: zodResolver(functionConfigSchema),
    values: {
      label: initialValue?.label ?? '',
      params: initialValue?.params ?? {},
      exec: initialValue?.exec ?? '',
      execTs:
        initialValue?.execTs ??
        `
/**
 * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
*/
async function handler(){
  return {};
}
      `,
    },          
  });  

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nodes = getNodes();

      if (
        nodes
          .filter((node) => node.id !== id)
          .map((node) => node?.data?.label)
          .includes(labelValue)
      ) {
        setLabelUniqueError(() => 'Task name already exist');
      } else {
        setLabelUniqueError(() => null);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [getNodes, id, labelValue]);

  const handleParamsEditorError = (error: string | null) => {
    setParamsEditorError(() => error);
  };

  const handleExecEditorError = (error: string | null) => {
    setExecEditorError(() => error);
  };

  const submitHandler = handleSubmit(async (value: z.infer<typeof functionConfigSchema>) => {
    onSubmit(value);
    toast({
      title: "Success",
      description: "Config changed successfully."
    })
    handleConfigPanelClose();
  });

  const handleConfigPanelOpen = () => {
    setOpenConfigPanel(() => true);
  };

  const handleConfigPanelClose = () => {
    setOpenConfigPanel(() => false);
  };  

  return (
    <>
      <Sheet open={openConfigPanel} onOpenChange={setOpenConfigPanel}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler as any)}>          
            <SheetTrigger asChild>
              <Button variant="outline" onClick={handleConfigPanelOpen}>
                Configure
                <span>
                  {Object.keys(form?.formState.errors).length > 0 ? (
                    <span className="absolute bg-red-500 text-red-100 px-2 py-1 text-xs font-bold rounded-full -top-2 -right-2">
                      {
                        Object.keys(form?.formState.errors).length +
                        (labelUniqueError ? 1 : 0) +
                        (execEditorError ? 1 : 0) +
                        (paramsEditorError ? 1 : 0)
                      }
                    </span>  
                  ) : null}
                </span>            
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[540px]">
              <SheetHeader>
                <SheetTitle>{[initialValue?.label, 'Configuration'].join(' ')}</SheetTitle>
                  <SheetDescription>
                    Make changes to Function Configuration panel.
                  </SheetDescription>
                </SheetHeader>
              <Separator className="mt-6" />
              <div className="grid gap-4 py-4">
                {activeStep === 0 && (
                  <>
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="Name of the Task"
                              {...field}
                            />
                          </FormControl>
                        <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormLabel>Params</FormLabel>
                    {paramsEditorError && (
                      <div className="flex gap-2">
                        <FormLabel className="text-red-600">{paramsEditorError}</FormLabel>
                      </div>
                    )}
                    <ParamsMonaco
                      initialValue={JSON.stringify(paramsObjectValue, undefined, 4)}
                      setValue={setValue}
                      setError={handleParamsEditorError}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setActiveStep(() => 1);
                      }}
                    >
                      Next&nbsp; <ChevronRight />
                    </Button>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <FormLabel>Function</FormLabel>
                    {execEditorError && (
                      <div className="flex gap-2">
                        <FormLabel className="text-red-600">{execEditorError}</FormLabel>
                      </div>
                    )}
                    <ExecMonaco
                      initialValue={execObjectValue}
                      setValue={setValue}
                      setError={handleExecEditorError}
                      params={paramsObjectValue}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setActiveStep(() => 0);
                      }}
                    >
                      <ChevronLeft /> &nbsp;Prev
                    </Button>
                  </>
                )}
                <SheetFooter>
                  <SheetClose asChild>
                    <Button 
                      type="submit"
                      onClick={() => {
                        toast({
                          title: "Success",
                          description: "Task changed successfully."
                        })
                      }}                  
                    >
                      Submit
                    </Button>
                  </SheetClose>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteNode();
                    }}
                  >
                    Delete Task
                  </Button>
                </SheetFooter>  
              </div>
            </SheetContent>
          </form>  
        </Form>
      </Sheet>
    </>
  );
};

export default FunctionConfigPanel;
