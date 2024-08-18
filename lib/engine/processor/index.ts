import { WorkflowLogger } from "../logger/index";

import { TaskStatus, type Task, TaskType } from "../tasks/index";

import { FunctionProcessor } from "./function";

import { safeAsync } from "@/lib/utils";
import { GuardProcessor } from "./guard";
import { WaitProcessor } from "./wait";

import { EngineService } from "../engine.service";

import { EngineTransport } from "../engine.transport";
import { BadRequestException } from "../engine.interface";
import { RuntimeStatus, Runtimes } from "@prisma/client";

export class Processor {
  private engineService: EngineService;
  private transportService: EngineTransport;
  constructor() {
    this.engineService = new EngineService();
    this.transportService = new EngineTransport();
  }

  async processTask(workflowRuntimeId: string, taskName: string) {
    console.log(`Processing ${taskName} Started`);

    const workflowRuntimeData = await this.engineService.findCurrentRuntime(
      workflowRuntimeId
    );

    if (!workflowRuntimeData) {
      throw new BadRequestException({
        message: "Bad Request",
        error: `Can not fetch runtime for runtime: ${workflowRuntimeId} and taskName: ${taskName}`,
        statusCode: 400,
      });
    }

    const tasks = workflowRuntimeData.tasks as unknown as Task[];

    const currentTask: Task | null | undefined = tasks.find(
      (item) => item.name === taskName
    );

    if (!currentTask) {
      console.error(
        `No currentTask found for runtime: ${workflowRuntimeId} and taskName: ${taskName}`
      );
      throw new BadRequestException({
        message: "Bad Request",
        error: `No currentTask found for runtime: ${workflowRuntimeId} and taskName: ${taskName}`,
        statusCode: 400,
      });
    }
    // Start Status
    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeId,
        currentTask.id,
        TaskStatus.started
      )
    );

    if (currentTask.type === "FUNCTION") {
      return this.processFunctionTask(workflowRuntimeData, currentTask);
    } else if (currentTask.type === "START") {
      return this.processStartTask(workflowRuntimeData, currentTask);
    } else if (currentTask.type === "END") {
      return this.processEndTask(workflowRuntimeData, currentTask);
    } else if (currentTask.type === "WAIT") {
      return this.processWaitTask(workflowRuntimeData, currentTask);
    } else if (currentTask.type === "GUARD") {
      return this.processGuardTask(workflowRuntimeData, currentTask);
    } else if (currentTask.type === "LISTEN") {
      return this.processListenTask(workflowRuntimeData, currentTask);
    } else {
      console.error(
        `Unknown Task type received: ${currentTask.type} for runtime: ${workflowRuntimeId} and taskName: ${taskName}`
      );
      throw new BadRequestException({
        statusCode: 400,
        message: "Bad Request",
        error: `Unknown Task type received: ${currentTask.type} for runtime: ${workflowRuntimeId} and taskName: ${taskName}`,
      });
    }
  }

  private async processFunctionTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    const loggerObj = new WorkflowLogger(currentTask.name);

    const params = currentTask.params ?? {};

    const global =
      (workflowRuntimeData?.global as unknown as Record<string, any>) ?? {};

    const resultMap = structuredClone(
      (workflowRuntimeData.workflowResults as unknown as Record<string, any>) ??
        {}
    );

    const functionProcessor = new FunctionProcessor();
    const processResult = await safeAsync(
      functionProcessor.process(
        params,
        global,
        loggerObj,
        resultMap,
        currentTask
      )
    );

    if (processResult.success === false) {
      console.error(`Task process failed for taskName: ${currentTask.name}`);
      console.error(processResult.error);

      // Fail Status
      await safeAsync(
        this.engineService.updateTaskStatus(
          workflowRuntimeData.id,
          currentTask.id,
          TaskStatus.failed
        )
      );

      return {
        status: "failure",
      };
    }

    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Logs
    const updatedLogs = loggerObj.Logs;

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        processResult.data?.response
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateRuntimeLogs(workflowRuntimeData.id, updatedLogs)
    );

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    const nextTasks = updatedTasks.filter(
      (item) =>
        currentTask.next.includes(item.name) && item.type !== TaskType.LISTEN
    );
    nextTasks.forEach((task) => {
      this.transportService.processNextTask({
        workflowRuntimeId: workflowRuntimeData.id,
        taskName: task.name,
      });
    });

    return {
      status: "success",
    };
  }

  private async processGuardTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    const loggerObj = new WorkflowLogger(currentTask.name);

    const params = currentTask.params ?? {};

    const global =
      (workflowRuntimeData?.global as unknown as Record<string, any>) ?? {};

    const resultMap = structuredClone(
      (workflowRuntimeData.workflowResults as unknown as Record<string, any>) ??
        {}
    );

    const guardProcessor = new GuardProcessor();
    const processResult = await safeAsync(
      guardProcessor.process(params, global, loggerObj, resultMap, currentTask)
    );

    if (processResult.success === false) {
      console.error(`Task process failed for taskName: ${currentTask.name}`);
      console.error(processResult.error);

      // Fail Status
      await safeAsync(
        this.engineService.updateTaskStatus(
          workflowRuntimeData.id,
          currentTask.id,
          TaskStatus.failed
        )
      );

      return {
        status: "failure",
      };
    }

    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Logs
    const updatedLogs = loggerObj.Logs;

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        processResult.data?.response
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateRuntimeLogs(workflowRuntimeData.id, updatedLogs)
    );

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    if (processResult?.data) {
      const nextTasks = updatedTasks.filter(
        (item) =>
          currentTask.next.includes(item.name) && item.type !== TaskType.LISTEN
      );
      nextTasks.forEach((task) => {
        this.transportService.processNextTask({
          workflowRuntimeId: workflowRuntimeData.id,
          taskName: task.name,
        });
      });
    }

    return {
      status: "success",
    };
  }

  private async processStartTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        {}
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    const nextTasks = updatedTasks.filter(
      (item) =>
        currentTask.next.includes(item.name) && item.type !== TaskType.LISTEN
    );
    nextTasks.forEach((task) => {
      this.transportService.processNextTask({
        workflowRuntimeId: workflowRuntimeData.id,
        taskName: task.name,
      });
    });

    return {
      status: "success",
    };
  }

  private async processEndTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        {}
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    return {
      status: "success",
    };
  }

  private async processWaitTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    if (currentTask.status === TaskStatus.completed) {
      return {
        status: "success",
      };
    }

    const allTasks = workflowRuntimeData.tasks as unknown as Task[];

    const waitProcessor = new WaitProcessor();
    const processResult = await safeAsync(
      waitProcessor.process(currentTask.params?.taskNames ?? [], allTasks)
    );

    if (processResult.success === false) {
      console.error(`Task process failed for taskName: ${currentTask.name}`);
      console.error(processResult.error);

      // Fail Status
      await safeAsync(
        this.engineService.updateTaskStatus(
          workflowRuntimeData.id,
          currentTask.id,
          TaskStatus.failed
        )
      );

      return {
        status: "failure",
      };
    }

    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        processResult.data?.response
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    if (processResult?.data) {
      const nextTasks = updatedTasks.filter(
        (item) =>
          currentTask.next.includes(item.name) && item.type !== TaskType.LISTEN
      );
      nextTasks.forEach((task) => {
        this.transportService.processNextTask({
          workflowRuntimeId: workflowRuntimeData.id,
          taskName: task.name,
        });
      });
    }

    return {
      status: "success",
    };
  }

  private async processListenTask(
    workflowRuntimeData: Runtimes,
    currentTask: Task
  ): Promise<{
    status: "success" | "failure";
  }> {
    if (currentTask.status === TaskStatus.completed) {
      return {
        status: "success",
      };
    }

    // Updated Task
    const updatedTasks: Task[] = [
      ...(workflowRuntimeData.tasks as unknown as Task[]),
    ];
    const updateIndex = updatedTasks.findIndex(
      (task) => task.id === currentTask.id
    );
    updatedTasks[updateIndex] = {
      ...updatedTasks[updateIndex],
      status: TaskStatus.completed,
    };

    // Updated Workflow Status
    let updatedWorkflowStatus: RuntimeStatus = RuntimeStatus.pending;
    const endTask = updatedTasks.find((task) => task.type === TaskType["END"]);
    const allCompleted = endTask?.status === "completed";
    if (allCompleted) {
      updatedWorkflowStatus = RuntimeStatus.completed;
    }

    // Updated Runtime
    await safeAsync(
      this.engineService.updateWorkflowResult(
        workflowRuntimeData.id,
        currentTask.name,
        {}
      )
    );

    if (updatedWorkflowStatus === RuntimeStatus.completed) {
      await safeAsync(
        this.engineService.updateWorkflowStatus(
          workflowRuntimeData.id,
          updatedWorkflowStatus
        )
      );
    }

    await safeAsync(
      this.engineService.updateTaskStatus(
        workflowRuntimeData.id,
        currentTask.id,
        TaskStatus.completed
      )
    );

    const nextTasks = updatedTasks.filter(
      (item) =>
        currentTask.next.includes(item.name) && item.type !== TaskType.LISTEN
    );
    nextTasks.forEach((task) => {
      this.transportService.processNextTask({
        workflowRuntimeId: workflowRuntimeData.id,
        taskName: task.name,
      });
    });

    return {
      status: "success",
    };
  }
}
