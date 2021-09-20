import { Logger } from '../utils/Logger';
import { Client } from 'ldapts';
import { ILdapCheckUserResult } from './ILdapCheckUserResult';
import { ILdapConnectionSettings } from './ILdapConnectionSettings';

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
                    minVersion: 'TLSv1.2',
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
        }
        try {
            await this.ldapClient.bind(user, password);
            result.success = true;
        } catch (err) {
            if (err instanceof Error) {
                result.error = err;
                Logger.getLogger().warn("Check for user " + user + " failed:", err);
            }
        }
        return result;
    }

}
