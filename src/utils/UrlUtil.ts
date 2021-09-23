import * as _ from "lodash";
import {IRedirectParameters} from "../types/IRedirectParameters";
import {Request} from "express";

/**
 * Static helper class for working with URLs.
 */
export class UrlUtil {
    /**
     * Returns the redirection parameters if defined.
     * @param req The request which could contain the parameters.
     */
    public static getRedirectParameters(req: Request): IRedirectParameters | undefined {
        const targetId = _.get(req, "body.targetId");
        const qpsUri = _.get(req, "body.proxyRestUri");
        if (targetId != null && qpsUri != null) {
            return {
                targetId,
                qpsUri,
            };
        }
        return undefined;
    }

    /**
     * Static class.
     */
    protected constructor() {
        // no op
    }
}
