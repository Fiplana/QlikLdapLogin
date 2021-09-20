import {Logger} from "./utils/Logger";
import {Application, Request, Response} from "express";
import path from "path";
import {QlikLdapLoginService} from "./QlikLdapLoginService";
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

    private static login(req: Request, res: Response): void {
        Logger.getLogger().info("Got login request for user: ");
        const connection = QlikLdapLoginService.getInstance().ldapConnection;
        if (req.params.username === undefined || req.params.password === undefined) {
            res.status(400);
            res.json({err: "Missing username or password!"});
            res.send();
            return;
        }
        connection
            .checkUser(req.params.username, req.params.password)
            .then(() => {
                res.status(200);
                res.send();
                return;
            })
            .catch((err) => {
                res.status(400);
                res.send(err.message);
                return;
            });
    }
}
