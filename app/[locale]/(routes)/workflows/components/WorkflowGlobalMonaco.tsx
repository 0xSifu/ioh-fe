"use client";

import type { OnChange, OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import type { ElementRef, FC } from 'react';
import { useRef } from 'react';

interface Props {
  initialValue: string;
  setError: Function;
  setValue: Function;
}

const WorkflowGlobalMonaco: FC<Props> = ({ initialValue, setError, setValue }) => {
  const theme = useTheme();
  const editorRef = useRef<ElementRef<typeof Editor>>();

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

  return (
    <Editor
      defaultValue={initialValue}
      onMount={onMount}
      onChange={handleChange}
      language="json"
      height={'50vh'}
      width={'60vh'}
      theme={theme.resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
    />
  );
};

export default WorkflowGlobalMonaco;
