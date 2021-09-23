import * as _ from "lodash";
import {Logger} from "./utils/Logger";
import {Application, Request, Response} from "express";
import path from "path";
import {QlikLdapLoginService} from "./QlikLdapLoginService";
import {QpsUtil} from "./utils/QpsUtil";
import {ConfigUtil} from "./utils/ConfigUtil";
/**
 * Router that handels incoming requests.
 */
export class Router {
    /**
     * Register routes on the express application.
     * @param app App to register the routes on.
     */
    public static registerRoutes(app: Application): void {
        app.get("/", Router.getLoginMask);
        app.post("/login", Router.login);
    }

    private static getLoginMask(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, "static", "index.html"));
    }

    private static async login(req: Request, res: Response): Promise<void> {
        const connection = QlikLdapLoginService.getInstance().ldapConnection;
        if (
            req.body.username === undefined ||
            req.body.username === "" ||
            req.body.password === undefined ||
            req.body.password === ""
        ) {
            res.status(400).json({err: "Missing username or password!"}).send();
            return;
        }
        Logger.getLogger().info("Got login request for user: ", req.body.username);
        const checkResult = await connection.checkUser(req.body.username, req.body.password);
        if (checkResult.success === false) {
            res.status(403)
                .json({err: _.get(checkResult, "error.message", "Unknown error occured.")})
                .send();
            return;
        } else {
            const userDirectory = ConfigUtil.getUserDirectory();
            if (checkResult.userId) {
                const ticketResp = await QpsUtil.requestTicket(
                    checkResult.userId,
                    userDirectory,
                    req.body.targetId != null ? req.body.targetId : undefined,
                );
                if (ticketResp.ticket === "") {
                    res.status(500).json({err: "Could not create ticket for qps."}).send();
                    return;
                }
                Logger.getLogger().debug("Url: " + _.trimEnd(ticketResp.redirectUrl, "/"));
                const redirectUrl = new URL(
                    _.trimEnd(ticketResp.redirectUrl, "/") + "?qlikTicket=" + ticketResp.ticket,
                );
                res.status(200).send({url: redirectUrl.toString()});
            } else {
                res.status(500).json({err: "No user identifier found"}).send();
            }
        }
    }
}
