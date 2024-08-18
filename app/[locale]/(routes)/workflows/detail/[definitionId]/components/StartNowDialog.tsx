"use client";

import type { ElementRef, FC } from 'react';
import { useRef, useState } from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from "next-themes";
import { PlayCircle, XCircle } from "lucide-react";
import { useForm } from 'react-hook-form';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

const startNowSchema = z.object({
  global: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
});

type StartNowSchema = z.infer<typeof startNowSchema>;

interface Props {
  workflowDefinitionId: string;
}

const StartNowDialog: FC<Props> = ({ workflowDefinitionId }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const editorRef = useRef<ElementRef<typeof Editor>>();

  const [startWorkflowLoading, setStartWorkflowLoading] = useState<boolean>(false);

  const { handleSubmit, setValue, reset, formState } = useForm<StartNowSchema>({
    resolver: zodResolver(startNowSchema),
    values: {
      global: {},
    },
  });

  const handleDialogOpen = () => {
    setOpen(() => true);
  };

  const handleDialogClose = () => {
    reset();
    setOpen(() => false);
  };

  const handleChange: OnChange = (value) => {
    if (value) {
      try {
        const parsedObject = JSON.parse(value);

        if (
          Object.keys(parsedObject)
            .map((k) => k?.trim())
            .includes('')
        ) {
          setError('No empty keys');
        } else {
          setValue('global', parsedObject);
          setError(null);
        }
      } catch (_error) {
        setError('Error parsing JSON');
      }
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor as ElementRef<typeof Editor>;;
  };

  const startWorkflowHandler = handleSubmit(async (values) => {
    setStartWorkflowLoading(() => true);

    axios
      .post(
        '/transport/start',
        {
          workflowDefinitionId,
          globalParams: values.global,
        },
      )
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Success",
          description: "Workflow started successfully."
        });
        handleDialogClose();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          console.error(error?.response?.data);
        } else {
          console.error(error);
        }
        toast({
          title: "Error",
          description: "Workflow start failed."
        })
      })
      .finally(() => {
        setStartWorkflowLoading(() => false);
      });
  });

  return (
    <>
      <Button variant="outline" onClick={handleDialogOpen}>
        Start Now&nbsp;<PlayCircle width="15" height="15" />
      </Button>
      <Dialog open={open}>
        <DialogTitle>Start Now</DialogTitle>
        <DialogContent className="w-full max-w-md">
          <div className="gap-y-0.5">
            <Label>Global Params</Label>
            {!!error && (
              <div className="flex flex-row justify-start items-center gap-x-0.5">
                <XCircle color="error" />
                <Label>{error}</Label>
              </div>
            )}
            <Editor
              defaultValue={JSON.stringify({}, undefined, 4)}
              onMount={onMount}
              onChange={handleChange}
              language="json"
              height={'30vh'}
              theme={theme.resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={startWorkflowLoading}
            variant="default"
            onClick={startWorkflowHandler}
            disabled={!!error || !formState.isValid}
          >
            Start
          </LoadingButton>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default StartNowDialog;
