import { Box } from '@radix-ui/themes';
import { Suspense } from 'react';

import ReactFlowProvider from "../components/ReactFlow";

import WorkflowCreate from './components/WorkflowCreate';
import WorkflowDefinitionContextProvider from '@/app/contexts/WorkflowDefinitionContext';
import Loading from '../loading';

import { getUser } from "@/actions/get-user";

const DefinitionCreatePage = async () => {

  const userData = await getUser();
  const userId = userData.id;

  return (
    <Box className="height: 80vh padding: 3">
      <ReactFlowProvider>
        <WorkflowDefinitionContextProvider>
          <Suspense fallback={<Loading />}>
            <WorkflowCreate userId={userId} />
          </Suspense>
        </WorkflowDefinitionContextProvider>
      </ReactFlowProvider>
    </Box>
  );
};

export default DefinitionCreatePage;
