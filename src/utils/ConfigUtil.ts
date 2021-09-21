import * as _ from "lodash";
import * as dotenv from "dotenv";
import fileExists from "file-exists";
import {readFileSync} from "fs";
import {Logger} from "./Logger";
import {resolve} from "path";
import {ILdapConnectionSettings} from "../types/ILdapConnectionSettings";

/**
 * Static helper class for config handling.
 */
export class ConfigUtil {
    /**
     * Returns the LDAP settings.
     */
    public static getLdapConnectionSettings(): ILdapConnectionSettings {
        dotenv.config({path: resolve(process.cwd(), ".env")});
        const host = _.get(process.env, "LDAP_HOST", "localhost");
        const useSsl = _.get(process.env, "LDAP_SSL", "no") === "yes";
        let defaultPort = 389;
        if (useSsl) {
            defaultPort = 636;
        }
        let port = parseInt(_.get(process.env, "LDAP_PORT", ""));
        if (!_.isFinite(port)) {
            Logger.getLogger().warn("Could not parse port ", process.env.LDAP_PORT);
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
        dotenv.config({path: resolve(process.cwd(), ".env")});
        return _.get(process.env, "QPS_URI", "https://qlikserver.example.org:4243/qps/customVirtualProxyPrefix");
    }

    /**
     * Returns the configured certificate path for authentication.
     */
    public static getClientPfx(): Buffer {
        dotenv.config({path: resolve(process.cwd(), ".env")});
        const clientPfxPath = resolve(_.get(process.env, "QPS_CERTIFICATE_PATH", "./client.pfx"));
        if (!fileExists(clientPfxPath)) {
            throw new Error("Could not find the certificate:" + clientPfxPath);
        }
        return readFileSync(clientPfxPath);
    }

    /**
     * Returns the configured certificate password.
     */
    public static getClientPfxPassword(): string {
        dotenv.config({path: resolve(process.cwd(), ".env")});
        return _.get(process.env, "QPS_CERTIFICATE_PASSWORD", "");
    }

    /**
     * Returns the configured redirect URI of the Qlik Sense hub.
     */
    public static getHubUri(): string {
        dotenv.config({path: resolve(process.cwd(), ".env")});
        return _.get(process.env, "HUB_URI", "https://qlikserver.example.org/hub/customVirtualProxyPrefix");
    }

    /**
     * Static class.
     */
    protected constructor() {
        // no op
    }
}
