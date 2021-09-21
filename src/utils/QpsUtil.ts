import * as _ from "lodash";
import axios from "axios";
import * as https from "https";
import urljoin from "url-join";
import {ConfigUtil} from "./ConfigUtil";

/**
 * Static helper class for handling the Qlik Proxy Service.
 */
export class QpsUtil {
    /**
     * Returns an authentication ticket for a certain user.
     * @param user The username.
     * @param directory The user directory of the user.
     */
    public static async requestTicket(user: string, directory: string): Promise<string> {
        const xrfKey = QpsUtil.generateXrfKey();
        const ticketUrl = urljoin(ConfigUtil.getQpsUri(), "ticket?xrfkey=" + xrfKey);
        const data = JSON.stringify({UserId: user, UserDirectory: directory, Attributes: []});
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
            data,
        });
        return _.get(response, "data.Ticket", "");
    }

    /**
     * Generates a Xrfkey which must be used prevent cross-site attacks.
     * @returns {string} The Xrfkey.
     */
    private static generateXrfKey(): string {
        /* eslint-enable max-len*/
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
