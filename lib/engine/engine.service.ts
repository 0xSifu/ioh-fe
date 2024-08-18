import { Task, TaskStatusType } from "./tasks";
import { LogObject } from "./logger";
import { prismadb } from "../prisma";
import { RuntimeStatus } from "@prisma/client";

export class EngineService {
  constructor() {}

  async findCurrentRuntime(id: string) {
    return await prismadb.runtimes.findUnique({
      where: {
        id: id,
      }
    });
  }

  async updateTaskStatus(
    workflowRuntimeId: string,
    currentTaskId: string,
    newStatus: TaskStatusType
  ) {
    const runtimeData = await prismadb.runtimes.findUnique({
      where: {
        id: workflowRuntimeId,
      }
    });

    if (!runtimeData) {
      return;
    }

    const taskList = runtimeData.tasks as unknown as Task[];

    const mappedTask = taskList?.map((val) => {
      if (val?.id === currentTaskId) {
        return {
          ...val,
          status: newStatus,
        };
      } else {
        return val;
      }
    });

    return await prismadb.runtimes.update({
      data: {
        // @ts-ignore-next-line
        tasks: mappedTask,
        runtimeTasks: {
          update: []
        },
        runtimeLogs: {
          update: []
        }
      },
      where: {
        id: workflowRuntimeId,
      },
    });
  }

  async updateWorkflowResult(
    workflowRuntimeId: string,
    currentTaskName: string,
    result: unknown
  ) {
    const runtimeData = await prismadb.runtimes.findUnique({
      where: {
        id: workflowRuntimeId,
      }      
    });

    if (!runtimeData) {
      return;
    }

    let updatedResult = runtimeData.workflowResults as unknown as Record<
      string,
      any
    >;

    updatedResult = {
      ...updatedResult,
      [`workflowResults.${currentTaskName}`]: result ?? {},
    };

    return await prismadb.runtimes.update({
      where: {
        id: workflowRuntimeId,
      },
      data: {
        workflowResults: updatedResult,
      },
    });
  }

  async updateWorkflowStatus(
    workflowRuntimeId: string,
    newStatus: RuntimeStatus
  ) {
    return await prismadb.runtimes.update({
      where: {
        id: workflowRuntimeId,
      },
      data: {
        workflowStatus: newStatus,
      },
    });
  }

  async updateRuntimeLogs(workflowRuntimeId: string, logs: LogObject[]) {
    const runtimeData = await prismadb.runtimes.findUnique({
      where: {
        id: workflowRuntimeId,
      }      
    });

    if (!runtimeData) {
      return;
    }

    let updatedLogs = runtimeData.logs as unknown as LogObject[];

    updatedLogs.push(...logs);

    return await prismadb.runtimes.update({
      where: {
        id: workflowRuntimeId,
      },
      data: {
        //@ts-ignore-next-line
        logs: updatedLogs,
      },
    });
  }
}
