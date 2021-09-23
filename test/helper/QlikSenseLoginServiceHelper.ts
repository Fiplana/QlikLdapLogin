import {QlikLdapLoginService} from "../../src/QlikLdapLoginService";
import {Application} from "express";

/**
 * Provide app getter.
 */
export class QlikLdapLoginServiceHelper extends QlikLdapLoginService {
    /**
     * Overload start method.
     */
    public static startServer(): void {
        if (QlikLdapLoginServiceHelper.instance !== undefined) {
            (QlikLdapLoginServiceHelper.instance as QlikLdapLoginServiceHelper).server?.close();
        }
        QlikLdapLoginServiceHelper.instance = new QlikLdapLoginServiceHelper();
    }

    /**
     * Instance getter.
     */
    public static getInstance(): QlikLdapLoginServiceHelper {
        return QlikLdapLoginServiceHelper.instance as QlikLdapLoginServiceHelper;
    }

    protected constructor() {
        super(9000);
    }

    /**
     * App getter.
     */
    public getApp(): Application {
        return this.app;
    }
}
