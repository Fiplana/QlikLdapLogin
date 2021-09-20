/**
 * Defines the settings for the LDAP connection.
 */
export interface ILdapConnectionSettings {

    /**
     * The hostname of the LDAP server, i.e. "openldap.example.org".
     */
    host: string;

    /**
     * The port the LDAP server is listening on, i.e. "636".
     */
    port: number;

    /**
     * Set to TRUE to use a secure connection.
     */
    useSsl: boolean;

}
