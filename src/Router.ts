import {Application, Request, Response} from "express";
import path from "path";
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
    }

    private static getLoginMask(req: Request, res: Response): void {
        res.sendFile(path.join(process.cwd(), "dist", "static", "index.html"));
    }
}
