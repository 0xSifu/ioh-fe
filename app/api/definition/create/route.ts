import { prismadb } from "@/lib/prisma";
import { safeAsync } from "@/lib/utils";
import { ServerRuntime } from "next";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime: ServerRuntime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  key: z.string(),
  ui: z.record(z.string(), z.any()).optional(),
  workflowData: z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "inactive"]),
    global: z.record(z.string(), z.any()).optional(),
    tasks: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        params: z.record(z.string(), z.any()).optional(),
        next: z.array(z.string()),
        previous: z.array(z.string()),
        exec: z.string().optional(),
        execTs: z.string().optional(),
      })
    ),
    userWfDefinitionId: z.string(),
  }),
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

  const definitionCreateResult = await safeAsync(
    prismadb.definitions.create({
      data: {
        name: requestBodyResult.data.workflowData.name,
        description: requestBodyResult.data.workflowData.description,
        definitionStatus: requestBodyResult.data.workflowData.status,
        global: requestBodyResult.data.workflowData.global ?? {},
        tasks: requestBodyResult.data.workflowData.tasks,
        ...(requestBodyResult.data?.ui && {
          uiObject: {
            [requestBodyResult.data.key]: requestBodyResult.data.ui,
          },
        }),
        userWfDefinitionId: requestBodyResult.data.workflowData.userWfDefinitionId,
      },
    })
  );

  if (!definitionCreateResult.success) {
    console.error(`Definition create failed`);
    console.error(definitionCreateResult.error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: `Definition create failed`,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Definition created successfully",
    },
    {
      status: 201,
    }
  );
};