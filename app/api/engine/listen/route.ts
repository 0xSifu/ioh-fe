import { Processor } from "@/lib/engine/processor";
import { Task } from "@/lib/engine/tasks";
import { prismadb } from "@/lib/prisma";
import { safeAsync } from "@/lib/utils";
import { ServerRuntime } from "next";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime: ServerRuntime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  workflowRuntimeId: z.string(),
  taskName: z.string(),
  globalParams: z.record(z.string(), z.any()).optional(),
});

export const POST = async (req: Request) => {
  const authValue = req.headers.get("x-api-key");

  if (!authValue) {
    return NextResponse.json(
      {
        message: "No Auth Header found",
      },
      {
        status: 401,
      }
    );
  }

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

  const runtimeResult = await safeAsync(
    prismadb.runtimes.findUnique({
      where: {
        id: requestBodyResult.data.workflowRuntimeId,
      }
    })
  );

  if (!runtimeResult.success) {
    console.error(
      `Runtimes findUnique failed for ${requestBodyResult.data.workflowRuntimeId}`
    );
    console.error(runtimeResult.error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: `Runtimes findUnique failed for ${requestBodyResult.data.workflowRuntimeId}`,
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
        error: `No data found for ${requestBodyResult.data.workflowRuntimeId}`,
      },
      {
        status: 400,
      }
    );
  }

  if (runtimeResult.data.workflowStatus === "completed") {
    return NextResponse.json(
      {
        message: "Bad Request",
        error: `Runtime for ${requestBodyResult.data.workflowRuntimeId} is completed`,
      },
      {
        status: 400,
      }
    );
  }

  const tasks = runtimeResult.data.tasks as unknown as Task[];

  const listenTask = tasks?.find(
    (task) => task.name === requestBodyResult.data.taskName
  );

  if (!listenTask) {
    return NextResponse.json(
      {
        message: "Bad Request",
        error: `Can not find Listen Task for Runtime ${requestBodyResult.data.workflowRuntimeId} and Task Name ${requestBodyResult.data.taskName}`,
      },
      {
        status: 400,
      }
    );
  }

  if (listenTask.status === "completed") {
    return NextResponse.json(
      {
        message: "Bad Request",
        error: `Listen Task for Runtime ${requestBodyResult.data.workflowRuntimeId} and Task Name ${requestBodyResult.data.taskName} is completed`,
      },
      {
        status: 400,
      }
    );
  }

  if (listenTask?.params?.apiKey !== authValue) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (Object.keys(requestBodyResult.data?.globalParams ?? {}).length > 0) {
    await safeAsync(
      prismadb.runtimes.update({
        data: {
          global: {
            ...((runtimeResult.data?.global as unknown as Record<
              string,
              any
            >) ?? {}),
            ...(requestBodyResult?.data?.globalParams ?? {}),
          },
        },
        where: {
          id: requestBodyResult.data.workflowRuntimeId,
        },
      })
    );
  }

  const processor = new Processor();

  const listenTaskProcessResult = await safeAsync(
    processor.processTask(
      requestBodyResult.data.workflowRuntimeId,
      requestBodyResult.data.taskName
    )
  );

  return NextResponse.json(
    {
      message: "Processing complete",
      data: {
        success: listenTaskProcessResult.success,
      },
    },
    { status: 200 }
  );
};
