import { safeSync } from "@/lib/utils";

export enum LogSeverity {
  "log" = "log",
  "info" = "info",
  "warn" = "warn",
  "error" = "error",
}

export interface LogObject {
  timestamp: string;
  taskName: string;
  log: string;
  severity: LogSeverity;
}

export class WorkflowLogger {
  logs: Array<LogObject> = [];
  taskName: string;

  constructor(taskName: string) {
    this.taskName = taskName;
  }

  log(severity: LogSeverity, ...message: any[]) {
    if (severity === LogSeverity.error) {
      const logAddResult = safeSync(() =>
        this.logs.push({
          timestamp: new Date().toJSON(),
          taskName: this.taskName,
          log: JSON.stringify(
            message?.map((item) =>
              JSON.stringify(item, Object.getOwnPropertyNames(item))
            )
          ),
          severity,
        })
      );

      if (logAddResult.success === false) {
        console.error(logAddResult.error);

        safeSync(() =>
          this.logs.push({
            timestamp: new Date().toJSON(),
            taskName: this.taskName,
            log: JSON.stringify(message),
            severity,
          })
        );
      }
    } else {
      safeSync(() =>
        this.logs.push({
          timestamp: new Date().toJSON(),
          taskName: this.taskName,
          log: JSON.stringify(message),
          severity,
        })
      );
    }
  }

  get Logs() {
    return this.logs;
  }
}
