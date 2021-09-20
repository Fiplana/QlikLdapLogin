import BunyanLogger from "bunyan";
// .d.ts file missing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bunyanDebugStream = require("bunyan-debug-stream");
import * as path from "path";
import fs from "fs";
/**
 * Wrapper class around the logger, which logs the the process output and in prod to a file.
 */
export class Logger {
    /**
     * Instance getter.
     */
    public static getLogger(): BunyanLogger {
        if (Logger.instance === undefined) {
            throw new Error("Logger not initialized!");
        } else {
            return Logger.instance.logger;
        }
    }

    /**
     * Initalizes the single instance.
     */
    public static initialize(): void {
        if (Logger.instance === undefined) {
            Logger.instance = new Logger();
        }
    }

    protected static instance?: Logger;
    protected logger: BunyanLogger;

    protected constructor() {
        const logFile = path.join(process.cwd(), "logs", "QlikSenseLdapService.log");
        if (!fs.existsSync(path.dirname(logFile))) {
            fs.mkdirSync(path.dirname(logFile));
        }
        this.logger = BunyanLogger.createLogger({
            name: "QlikSenseLdapService",
            streams: [
                {
                    level: process.env.NODE_ENV === "production" ? "info" : "debug",
                    stream: bunyanDebugStream({
                        basepath: process.cwd(),
                        forceColor: true,
                    }),
                },
                {
                    level: "info",
                    name: "file",
                    path: logFile,
                },
            ],
            serializers: bunyanDebugStream.serializers,
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
        });
    }
}
