import {ILdapConnectionSettings} from "../ldap/ILdapConnectionSettings";
import * as _ from "lodash";
import * as dotenv from "dotenv";
import {Logger} from "./Logger";
import {resolve} from "path";

/**
 * Static helper class for config handling.
 */
export class ConfigUtil {
    /**
     * Returns the LDAP settings.
     */
    public static getLdapConnectionSettings(): ILdapConnectionSettings {
        dotenv.config({path: resolve(__dirname, "../../.env")});
        const host = _.get(process.env, "LDAP_HOST", "localhost");
        const port = Number(_.get(process.env, "LDAP_PORT", 389));
        const useSsl = _.get(process.env, "LDAP_SSL", "no") === "yes";
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
