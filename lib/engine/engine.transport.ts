import axios, { AxiosError } from "axios";

const SELF_URL = process.env?.SELF_URL
  ? `http://${process.env?.SELF_URL}`
  : process.env.SELF_URL;

export class EngineTransport {
  constructor() {}

  async processNextTask(body: { workflowRuntimeId: string; taskName: string }) {
    const apiKey = process.env.ENGINE_API_KEY ?? "";

    axios({
      method: "POST",
      baseURL: SELF_URL,
      url: "@/app/api/engine/internal",
      data: {
        workflowRuntimeId: body.workflowRuntimeId,
        taskName: body.taskName,
      },
      headers: {
        Authorization: `Basic ${apiKey}`,
      },
    }).catch((error) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    });
  }
}
