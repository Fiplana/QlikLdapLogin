import * as _ from "lodash";
import * as dotenv from "dotenv";
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
        const settings: ILdapConnectionSettings = {
            host,
            port,
            useSsl,
        };
        Logger.getLogger().info("Current LDAP configuration: ", settings);
        return settings;
    }

    /**
     * Static class.
     */
    protected constructor() {
        // no op
    }
}
