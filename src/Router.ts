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
        const connection = QlikLdapLoginService.getInstance().ldapConnection;
        if (req.params.user === undefined || req.params.password === undefined) {
            res.status(400);
            res.send("Missing username or password!");
            return;
        }
        connection
            .checkUser(req.params.user, req.params.password)
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
