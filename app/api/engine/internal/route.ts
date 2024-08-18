import { Processor } from "@/lib/engine/processor";
import { safeAsync } from "@/lib/utils";
import { ServerRuntime } from "next";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime: ServerRuntime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  workflowRuntimeId: z.string(),
  taskName: z.string(),
});

export const POST = async (req: Request) => {
  const apiKey = process.env.ENGINE_API_KEY ?? "";
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      {
        message: "No Auth Header found",
      },
      {
        status: 401,
      }
    );
  }

  const [authType, authValue] = authHeader.split(" ");

  if (authValue !== apiKey) {
    return NextResponse.json(
      {
        message: "Wrong Credentials",
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

  const processor = new Processor();

  const processTaskResult = await safeAsync(
    processor.processTask(
      requestBodyResult.data.workflowRuntimeId,
      requestBodyResult.data.taskName
    )
  );

  if (!processTaskResult.success) {
    console.error(processTaskResult.error);
  }

  return NextResponse.json(
    {
      message: "Processor called",
      data: {
        success: processTaskResult.success,
      },
    },
    {
      status: processTaskResult.success ? 200 : 500,
    }
  );
};
