import express, {Application} from "express";
import {createServer, Server as HTTPSServer} from "https";
import {Server as HTTPServer} from "http";
import {ITLSOptions} from "./types/ITLSOptions";
import fs from "fs";
import {Logger} from "./utils/Logger";

/**
 * This is the service class.
 */
export class QlikLdapLoginService {
    /**
     * Default port to listen on.
     */
    public static defaultServicePort = 9000;

    /**
     * Starts the service.
     */
    public static startServer(): void {
        const port = QlikLdapLoginService.getPort();
        if (QlikLdapLoginService.instance === undefined) {
            QlikLdapLoginService.instance = new QlikLdapLoginService(port);
        }
    }

    /**
     * Get's the port from an env var or usese default one.
     */
    public static getPort(): number {
        if (process.env.SERVER_PORT !== undefined && !isNaN(parseInt(process.env.SERVER_PORT))) {
            return parseInt(process.env.SERVER_PORT);
        }
        return QlikLdapLoginService.defaultServicePort;
    }

    /**
     * Returns the TLS Options if the certificates and the env vars are provided.
     */
    public static getTlsStartOptions(): ITLSOptions | undefined {
        if (
            process.env.CERT_FILE_PATH !== undefined &&
            fs.existsSync(process.env.CERT_FILE_PATH) &&
            process.env.KEY_FILE_PATH !== undefined &&
            fs.existsSync(process.env.KEY_FILE_PATH)
        ) {
            return {
                cert: fs.readFileSync(process.env.CERT_FILE_PATH),
                key: fs.readFileSync(process.env.KEY_FILE_PATH),
            };
        }
        return undefined;
    }

    private static instance: QlikLdapLoginService;

    private readonly app: Application;
    private readonly server?: HTTPSServer | HTTPServer;

    private constructor(port: number) {
        this.app = express();
        Logger.initialize();
        const tlsOptions = QlikLdapLoginService.getTlsStartOptions();
        if (tlsOptions !== undefined) {
            this.server = createServer(tlsOptions, this.app).listen(port, () => {
                Logger.getLogger().info("Service Interface listening on HTTPS-Port !" + port);
            });
        } else {
            this.server = this.app.listen(port, () => {
                Logger.getLogger().info("Service Interface listening on HTTP-Port " + port);
            });
        }
    }
}

QlikLdapLoginService.startServer();
