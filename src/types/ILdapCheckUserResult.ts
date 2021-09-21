/**
 * Contains the check user result.
 */
export interface ILdapCheckUserResult {
    /**
     * TRUE, if the user can be bound to the LDAP.
     */
    success: boolean;

    /**
     * Optional error if the user cannot be bouind to the LDAP.
     */
    error?: Error;

    /**
     * The user identifier.
     */
    userId?: string;
}
