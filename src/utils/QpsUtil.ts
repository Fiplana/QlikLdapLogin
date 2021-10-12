import * as _ from "lodash";
import axios from "axios";
import * as https from "https";
import urljoin from "url-join";
import {ConfigUtil} from "./ConfigUtil";
import {Logger} from "./Logger";
import {ITicketResponse} from "../types/ITicketResponse";
import {IRedirectParameters} from "../types/IRedirectParameters";
import {ITicketData} from "../types/ITicketData";

/**
 * Static helper class for handling the Qlik Proxy Service.
 */
export class QpsUtil {
    /**
     * Returns an authentication ticket for a certain user.
     * @param user The username.
     * @param directory The user directory of the user.
     * @param redirectParameters The (optional) redirection parameters.
     */
    public static async requestTicket(
        user: string,
        directory: string,
        redirectParameters?: IRedirectParameters,
    ): Promise<ITicketResponse> {
        Logger.getLogger().info("Requesting a ticket for " + directory + "\\" + user + " ...");
        let result: ITicketResponse = {
            redirectUrl: "",
            ticket: "",
        };
        const xrfKey = QpsUtil.generateXrfKey();
        const data: ITicketData = {
            UserId: user,
            UserDirectory: directory,
        };
        if (redirectParameters?.targetId !== undefined) {
            data.TargetId = redirectParameters.targetId;
            Logger.getLogger().info("Found target identifier: " + data.TargetId);
        }
        try {
            result = await QpsUtil.requestQpsForTicket(redirectParameters, xrfKey, data);
            Logger.getLogger().info("Ticket request completed.");
        } catch (error: unknown) {
            Logger.getLogger().warn(error);
        }
        return result;
    }

    private static async requestQpsForTicket(
        redirectParameters: IRedirectParameters | undefined,
        xrfKey: string,
        data: ITicketData,
    ): Promise<ITicketResponse> {
        const result: ITicketResponse = {
            redirectUrl: "",
            ticket: "",
        };
        const response = await axios({
            url: QpsUtil.getTicketUrl(redirectParameters, xrfKey),
            method: "POST",
            headers: {
                "X-Qlik-Xrfkey": xrfKey,
                "Content-Type": "application/json",
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                pfx: ConfigUtil.getClientPfx(),
                passphrase: ConfigUtil.getClientPfxPassword(),
            }),
            data: JSON.stringify(data),
        });
        const ticket = _.get(response, "data.Ticket");
        if (ticket != null) {
            result.ticket = ticket;
        }
        const targetUri = _.get(response, "data.TargetUri");
        if (targetUri != null) {
            result.redirectUrl = targetUri;
            Logger.getLogger().info("Target identifier resolved: " + result.redirectUrl);
        } else {
            result.redirectUrl = ConfigUtil.getHubUri();
        }
        return result;
    }

    private static getTicketUrl(redirectParameters: IRedirectParameters | undefined, xrfKey: string) {
        let qpsUri = ConfigUtil.getQpsUri();
        if (redirectParameters?.qpsUri !== undefined) {
            qpsUri = redirectParameters.qpsUri;
        }
        const ticketUrl = urljoin(qpsUri, "ticket?xrfkey=" + xrfKey);
        Logger.getLogger().info("Ticket request URL: " + ticketUrl);
        return ticketUrl;
    }

    /**
     * Generates a Xrfkey which must be used prevent cross-site attacks.
     * @returns The Xrfkey.
     */
    private static generateXrfKey(): string {
        const xrfKeyLength = 16;
        const xrfKey = [];
        // prettier-ignore
        const allowCharacters = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ];
        for (let i = 0; i < xrfKeyLength; i++) {
            const randomChar = allowCharacters[Math.round(Math.random() * (allowCharacters.length - 1))];
            xrfKey.push(randomChar);
        }
        return xrfKey.join("");
    }

    /**
     * Static class.
     */
    protected constructor() {
        // no op
    }
}
