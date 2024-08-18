import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
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

const endConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
});

export type EndConfigSchema = z.infer<typeof endConfigSchema>;

interface Props {
  onSubmit: (value: EndConfigSchema) => void;
  initialValue: EndConfigSchema;
  deleteNode: Function;
  id: string;
}

const EndConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const [ isLoading ] = useState<boolean>(false);
  const { toast } = useToast();

  const [ openConfigPanel, setOpenConfigPanel ] = useState<boolean>(false);  
  const { getNodes } = useReactFlow();
  const [ labelUniqueError, setLabelUniqueError ] = useState<string | null>(null);
  
  const { handleSubmit, watch } = useForm<EndConfigSchema>({
    resolver: zodResolver(endConfigSchema),
    values: {
      label: initialValue?.label ?? '',
    },
  });

  const labelValue = watch('label');

  const form = useForm<EndConfigSchema>({
    resolver: zodResolver(endConfigSchema),
    values: {
      label: initialValue?.label ?? '',
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
        setLabelUniqueError(() => 'Task name already exists');
      } else {
        setLabelUniqueError(() => null);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [getNodes, id, labelValue]);

  const submitHandler = handleSubmit(async (value: z.infer<typeof endConfigSchema>) => {
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
                      {Object.keys(form?.formState.errors).length + (labelUniqueError ? 1 : 0)}
                    </span>  
                  ) : null}
                </span>            
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[540px]">
              <SheetHeader>
                <SheetTitle>{[initialValue?.label, 'Configuration'].join(' ')}</SheetTitle>
                  <SheetDescription>
                    Make changes to End Configuration panel.
                  </SheetDescription>
                </SheetHeader>
              <Separator className="mt-6" />
              <div className="grid gap-4 py-4">
                <div className="space-y-2 w-full">
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
                </div>                
              </div>
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
            </SheetContent>
          </form>
        </Form>
      </Sheet>
    </>
  );
};

export default EndConfigPanel;
