/**
 * The payload for a ticket request.
 */
export interface ITicketData {
    /**
     * The user identifier.
     */
    UserId: string;
    /**
     * The user directory.
     */
    UserDirectory: string;
    /**
     * (optional) Target identifier (GUID for request).
     */
    TargetId?: string;
}
