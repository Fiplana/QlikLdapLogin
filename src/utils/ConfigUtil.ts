import * as _ from "lodash";
import nconf from "nconf";
import {readFileSync, existsSync} from "fs";
import {Logger} from "./Logger";
import {resolve} from "path";
import {ILdapConnectionSettings} from "../types/ILdapConnectionSettings";
import {QlikLdapLoginService} from "../QlikLdapLoginService";

/**
 * Static helper class for config handling.
 */
export class ConfigUtil {
    /**
     * "Setup nconf.
     * 1. Command-line arguments
     * 2. Environment variables
     * 3. A file located at 'path/to/config.json'""
     * Source: https://www.npmjs.com/package/nconf
     */
    public static setup(): void {
        nconf.argv().env().file(process.cwd(), "env.json");
    }
    /**
     * Returns the LDAP settings.
     */
    public static getServerPort(): number {
        const port = nconf.get("SERVER_PORT") ?? QlikLdapLoginService.defaultServicePort;
        if (_.isFinite(parseInt(port))) {
            return parseInt(port);
        }
        return QlikLdapLoginService.defaultServicePort;
    }

    /**
     * Returns the LDAP settings.
     */
    public static getLdapConnectionSettings(): ILdapConnectionSettings {
        const host = nconf.get("LDAP_HOST") ?? "localhost";
        const useSsl = (nconf.get("LDAP_SSL") ?? "no") === "yes";
        let defaultPort = 389;
        if (useSsl) {
            defaultPort = 636;
        }
        let port = parseInt(nconf.get("LDAP_PORT") ?? "");
        if (!_.isFinite(port)) {
            Logger.getLogger().warn("Could not parse port ", nconf.get("LDAP_PORT"));
            port = defaultPort;
        }
        return {
            host,
            port,
            useSsl,
        };
    }

    /**
     * Returns the configured URI of the QPS.
     */
    public static getQpsUri(): string {
        return nconf.get("QPS_URI") ?? "https://qlikserver.example.org:4243/qps/customVirtualProxyPrefix";
    }

    /**
     * Returns the cached certificate for authentication.
     */
    public static getClientPfx(): Buffer {
        const clientPfxPath = resolve(nconf.get("QPS_CERTIFICATE_PATH") ?? "./client.pfx");
        if (!ConfigUtil.clientPfxCache.has(clientPfxPath)) {
            if (!existsSync(clientPfxPath)) {
                throw new Error("Could not find the certificate:" + clientPfxPath);
            }
            ConfigUtil.clientPfxCache.set(clientPfxPath, readFileSync(clientPfxPath));
        }
        const certificate = ConfigUtil.clientPfxCache.get(clientPfxPath);
        if (certificate == null) {
            throw new Error("client.pfx must not be NULL or empty");
        }
        return certificate;
    }

    /**
     * Returns the user directory for all users.
     */
    public static getUserDirectory(): string {
        return nconf.get("USER_DIRECTORY_NAME") ?? "EXAMPLE";
    }

    /**
     * Returns the LDAP field name for the user identifier.
     */
    public static getLdapUserIdField(): string {
        return nconf.get("LDAP_USERID_FIELD") ?? "uid";
    }

    /**
     * Returns the configured certificate password.
     */
    public static getClientPfxPassword(): string {
        return nconf.get("QPS_CERTIFICATE_PASSWORD") ?? "";
    }

    /**
     * Returns the configured redirect URI of the Qlik Sense hub.
     */
    public static getHubUri(): string {
        return nconf.get("HUB_URI") ?? "https://qlikserver.example.org/hub/customVirtualProxyPrefix";
    }

    private static clientPfxCache = new Map<string, Buffer>();

    /**
     * Static class.
     */
    protected constructor() {
        // no op
    }
}
