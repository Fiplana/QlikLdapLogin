/**
 * Ticket request response.
 */
export interface ITicketResponse {
    /**
     * The ticket string.
     */
    ticket: string;
    /**
     * Url where the user should be redirected to.
     */
    redirectUrl: string;
}
