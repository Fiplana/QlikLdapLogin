import express, {Application} from "express";
import {createServer, Server as HTTPSServer} from "https";
import {Server as HTTPServer} from "http";
import {ITLSOptions} from "./types/ITLSOptions";
import fs from "fs";
import {Logger} from "./utils/Logger";
import {Router} from "./Router";
import path from "path";
import {LdapConnection} from "./ldap/LdapConnection";
import {ILdapConnectionSettings} from "./types/ILdapConnectionSettings";

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

    /**
     * Get ldap connection params from env vars.
     */
    public static getLdapConnectionFromEnv(): ILdapConnectionSettings {
        let port;
        if (process.env.LDAP_PORT !== undefined && !isNaN(parseInt(process.env.LDAP_PORT))) {
            port = parseInt(process.env.LDAP_PORT);
        }
        let useSsl = false;
        if (process.env.LDAP_SSL !== undefined && (process.env.LDAP_SSL == "true" || process.env.LDAP_SSL == "false")) {
            useSsl = Boolean(process.env.LDAP_SSL);
            if (useSsl && port === undefined) {
                port = 686;
            }
        }
        if (port === undefined) {
            port = 389;
        }
        return {
            host: process.env.LDAP_HOST ?? "127.0.0.1",
            port,
            useSsl,
        };
    }
    /**
     * Instance getter.
     */
    public static getInstance(): QlikLdapLoginService {
        return QlikLdapLoginService.instance;
    }

    private static instance: QlikLdapLoginService;

    /**
     * The signle ldap connection.
     */
    public readonly ldapConnection: LdapConnection;
    private readonly app: Application;
    private readonly server?: HTTPSServer | HTTPServer;

    private constructor(port: number) {
        Logger.initialize();
        this.ldapConnection = new LdapConnection(QlikLdapLoginService.getLdapConnectionFromEnv());
        this.app = express();
        this.registerStaticDirs();
        Router.registerRoutes(this.app);
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

    private registerStaticDirs(): void {
        const bootstrapJsPath = path.join(process.cwd(), "node_modules", "bootstrap", "dist", "js");
        const bootstrapCssPath = path.join(process.cwd(), "node_modules", "bootstrap", "dist", "css");
        const popperJsPath = path.join(process.cwd(), "node_modules", "popper.js", "dist");
        const particlesJsPath = path.join(process.cwd(), "node_modules", "particles.js");
        const staticContent = path.join(process.cwd(), "dist", "static");
        Logger.getLogger().debug("Bootstrap js files will be served from: " + bootstrapJsPath);
        Logger.getLogger().debug("Bootstrap css files will be served from: " + bootstrapCssPath);
        Logger.getLogger().debug("Popper js files will be served from: " + popperJsPath);
        Logger.getLogger().debug("Particlesjs files will be served from: " + particlesJsPath);
        Logger.getLogger().debug("Static files will be served from: " + staticContent);
        this.app.use("/bootstrapJs", express.static(bootstrapJsPath));
        this.app.use("/bootstrapCss", express.static(bootstrapCssPath));
        this.app.use("/popperJs", express.static(popperJsPath));
        this.app.use("/static", express.static(staticContent));
        this.app.use("/particlesJs", express.static(particlesJsPath));
    }
}
QlikLdapLoginService.startServer();