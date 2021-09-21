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
        res.sendFile(path.join(process.cwd(), "dist", "static", "index.html"));
    }

    private static async login(req: Request, res: Response): Promise<void> {
        const connection = QlikLdapLoginService.getInstance().ldapConnection;
        if (
            req.body.username === undefined ||
            req.body.username === "" ||
            req.body.password === undefined ||
            req.body.password === ""
        ) {
            res.status(400);
            res.json({err: "Missing username or password!"});
            res.send();
            return;
        }
        Logger.getLogger().info("Got login request for user: ", req.body.username);
        const checkResult = await connection.checkUser(req.body.username, req.body.password);
        if (checkResult.success === false) {
            res.status(403);
            res.json({err: _.get(checkResult, "error.message", "Unknown error occured.")});
            res.send();
            return;
        } else {
            const userDirectory = ConfigUtil.getUserDirectory();
            if (checkResult.userId) {
                const ticket = QpsUtil.requestTicket(checkResult.userId, userDirectory);
                const redirectUrl = new URL(ConfigUtil.getHubUri() + "?qlikTicket=" + ticket);
                res.redirect(redirectUrl.toString());
                return;
            } else {
                res.status(500);
                res.json({err: "No user identifier found"});
                res.send();
                return;
            }
        }
    }
}
