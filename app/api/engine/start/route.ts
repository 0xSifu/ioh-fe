import { Processor } from "@/lib/engine/processor";
import { Task, TaskStatus, TaskType } from "@/lib/engine/tasks";
import { prismadb } from "@/lib/prisma";
import { safeAsync } from "@/lib/utils";
import { RuntimeStatus } from "@prisma/client";
import { ServerRuntime } from "next";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime: ServerRuntime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  workflowDefinitionId: z.string(),
  globalParams: z.record(z.string(), z.any()).optional(),
});
export const POST = async (req: Request) => {
  const bodyResult = await safeAsync(req.json());

  if (!bodyResult.success) {
    return NextResponse.json(
      {
        message: "Body json parse failed",
      },
      {
        status: 400,
      }
    );
  }

  const requestBodyResult = bodySchema.safeParse(bodyResult.data);

  if (!requestBodyResult.success) {
    console.error(requestBodyResult.error);
    return NextResponse.json(
      {
        message: "Bad Request body",
        error: requestBodyResult.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const definitionResult = await safeAsync(
    prismadb.definitions.findUnique({
      where: {
        id: requestBodyResult.data.workflowDefinitionId,
      },
    })
  );

  if (!definitionResult.success) {
    console.error(
      `Definitions findUnique failed for ${requestBodyResult.data.workflowDefinitionId}`
    );
    console.error(definitionResult.error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: `Definitions findUnique failed for ${requestBodyResult.data.workflowDefinitionId}`,
      },
      {
        status: 500,
      }
    );
  }

  if (!definitionResult.data) {
    return NextResponse.json(
      {
        message: "Bad Request",
        error: `Can not find definition for ${requestBodyResult.data.workflowDefinitionId}`,
      },
      {
        status: 400,
      }
    );
  }

  const tasks = definitionResult.data.tasks as unknown as Task[];
  const globalObject = definitionResult.data?.global as unknown as Record<
    string,
    any
  >;

  const runtimeResult = await safeAsync(
    prismadb.runtimes.create({
      data: {
        workflowDefinitionId: definitionResult.data.id,
        workflowStatus: RuntimeStatus.pending,
        workflowResults: {},
        tasks: tasks.map((t) => ({
          ...t,
          status: TaskStatus.pending,
        })),
        global: {
          ...(globalObject && {
            ...globalObject,
          }),
          ...(requestBodyResult.data?.globalParams && {
            ...requestBodyResult.data?.globalParams,
          }),
        },
        logs: [],
      },
    })
  );

  if (!runtimeResult.success) {
    console.error(
      `Runtime create failed for ${requestBodyResult.data.workflowDefinitionId}`
    );

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: `Runtime create failed for ${requestBodyResult.data.workflowDefinitionId}`,
      },
      {
        status: 500,
      }
    );
  }

  if (!runtimeResult.data) {
    return NextResponse.json(
      {
        message: "Bad Request",
        error: `Can not create runtime for ${requestBodyResult.data.workflowDefinitionId}`,
      },
      {
        status: 400,
      }
    );
  }

  const runtimeTask = runtimeResult.data.tasks as unknown as Task[];

  const startTaskName = runtimeTask.find(
    (val) => val.type === TaskType.START
  )?.name;

  if (!startTaskName) {
    return NextResponse.json({
      message: "Bad Request",
      error: `Can not find ${TaskType.START} task of runtime ${runtimeResult.data.id}`,
    });
  }

  const processor = new Processor();

  const processTaskResult = await safeAsync(
    processor.processTask(runtimeResult.data.id, startTaskName)
  );

  if (!processTaskResult.success) {
    console.error(processTaskResult.error);
  }

  return NextResponse.json(
    {
      message: "Process executed",
      data: {
        success: processTaskResult.success,
      },
    },
    {
      status: 200,
    }
  );
};