import {Logger} from "../utils/Logger";
import {Client} from "ldapts";
import {ILdapCheckUserResult} from "../types/ILdapCheckUserResult";
import {ILdapConnectionSettings} from "../types/ILdapConnectionSettings";
import {ConfigUtil} from "../utils/ConfigUtil";
import * as _ from "lodash";

/**
 * Wrapper class for ldapts
 */
export class LdapConnection {
    private ldapClient: Client;

    /**
     * @param ldapConnectionSettings The LDAP connection settings.
     */
    constructor(ldapConnectionSettings: ILdapConnectionSettings) {
        if (!ldapConnectionSettings.useSsl) {
            this.ldapClient = new Client({
                url: "ldap://" + ldapConnectionSettings.host + ":" + ldapConnectionSettings.port,
                timeout: 20000,
                connectTimeout: 20000,
            });
        } else {
            this.ldapClient = new Client({
                url: "ldaps://" + ldapConnectionSettings.host + ":" + ldapConnectionSettings.port,
                timeout: 20000,
                connectTimeout: 20000,
                tlsOptions: {
                    minVersion: "TLSv1.2",
                },
            });
        }
    }

    /**
     * Checks the username and password.
     * @param user The username in LDAP syntax, i.e. "cn=admin,dn=example,dn=org".
     * @param password The password of the user.
     * @returns A promise that fulfills, if everything is ok.
     */
    public async checkUser(user: string, password: string): Promise<ILdapCheckUserResult> {
        const result: ILdapCheckUserResult = {
            success: false,
        };
        try {
            await this.ldapClient.bind(user, password);
            const {searchEntries} = await this.ldapClient.search(user, {
                attributes: [ConfigUtil.getLdapUserIdField()],
                returnAttributeValues: true,
            });
            if (_.get(searchEntries, "length") !== 1) {
                Logger.getLogger().warn("Unexpected LDAP result", searchEntries);
                throw new Error("LDAP search returns an unexpected result");
            } else {
                const userId = _.get(searchEntries[0], ConfigUtil.getLdapUserIdField());
                if (!_.isString(userId) || userId.length < 1) {
                    Logger.getLogger().warn("Unexpected User result", userId);
                    throw new Error("Unexpected User result");
                }
                result.userId = userId;
                result.success = true;
            }
        } catch (err) {
            if (err instanceof Error) {
                result.error = err;
                Logger.getLogger().warn("Check for user " + user + " failed:", err);
            }
        } finally {
            await this.ldapClient.unbind();
        }
        return result;
    }
}
