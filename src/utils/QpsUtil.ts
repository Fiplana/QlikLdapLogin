import * as _ from "lodash";
import axios from "axios";
import * as https from "https";
import urljoin from "url-join";
import {ConfigUtil} from "./ConfigUtil";
import {Logger} from "./Logger";
import {ITicketResponse} from "../types/ITicketResponse";

/**
 * Static helper class for handling the Qlik Proxy Service.
 */
export class QpsUtil {
    /**
     * Returns an authentication ticket for a certain user.
     * @param user The username.
     * @param directory The user directory of the user.
     * @param targetId Target where the user should be redirected to.
     */
    public static async requestTicket(user: string, directory: string, targetId?: string): Promise<ITicketResponse> {
        const xrfKey = QpsUtil.generateXrfKey();
        const ticketUrl = urljoin(ConfigUtil.getQpsUri(), "ticket?xrfkey=" + xrfKey);
        const data: {UserId: string; UserDirectory: string; TargetId?: string} = {
            UserId: user,
            UserDirectory: directory,
        };
        if (targetId !== undefined) {
            data.TargetId = encodeURIComponent(targetId);
        }
        Logger.getLogger().debug(JSON.stringify(data));
        Logger.getLogger().debug(ticketUrl);
        try {
            const response = await axios({
                url: ticketUrl,
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
            return {
                ticket: _.get(response, "data.Ticket", ""),
                redirectUrl: _.get(response, "data.TargetUri", ConfigUtil.getHubUri()) ?? ConfigUtil.getHubUri(),
            };
        } catch (error: unknown) {
            Logger.getLogger().warn(error);
        }
        return {ticket: "", redirectUrl: ""};
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
