import { Box } from '@radix-ui/themes';
import { Suspense } from 'react';

import ReactFlowProvider from "../../components/ReactFlow";

import WorkflowEdit from './components/WorkflowEdit';
import WorkflowDefinitionContextProvider from '@/app/contexts/WorkflowDefinitionContext';
import Loading from '../../loading';

import { getDefinitionSingle } from '@/actions/workflows/get-definition-single';

const DefinitionEditPage = async ({
  params: { definitionId },
}: {
  params: { definitionId: string };
}) => {

  const editData = await getDefinitionSingle(definitionId);
  
  return (
    <Box className="height: 80vh padding: 3">
      <ReactFlowProvider>
        <WorkflowDefinitionContextProvider>
          <Suspense fallback={<Loading />}>
            <WorkflowEdit editData={editData} />
          </Suspense>
        </WorkflowDefinitionContextProvider>
      </ReactFlowProvider>
    </Box>
  );
};

export default DefinitionEditPage;