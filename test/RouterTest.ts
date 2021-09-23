import {Application} from "express";
import {before, describe, it} from "mocha";
import {expect} from "chai";
import request from "supertest";
import {QlikLdapLoginServiceHelper} from "./helper/QlikSenseLoginServiceHelper";
import {LdapConnection} from "../src/ldap/LdapConnection";
import {ConfigUtil} from "../src/utils/ConfigUtil";

//dev build must run bevore
describe("Router", () => {
    let app: Application;
    before(() => {
        QlikLdapLoginServiceHelper.startServer();
        app = QlikLdapLoginServiceHelper.getInstance().getApp();
    });
    describe("/ GET", () => {
        it("should get index page", async () => {
            await request(app).get("/").expect(200);
        });
    });
    describe("/login", () => {
        it("should get bad request for undefined username", async () => {
            await request(app).post("/login").send("password=123").expect(400, {
                err: "Missing username or password!",
            });
        });
        it("should get bad request for empty username", async () => {
            await request(app).post("/login").send("password=123").send("username=").expect(400, {
                err: "Missing username or password!",
            });
        });
        it("should get bad request for undefined password", async () => {
            await request(app).post("/login").send("username=123").expect(400, {
                err: "Missing username or password!",
            });
        });
        it("should get bad request for empty password", async () => {
            await request(app).post("/login").send("username=123").send("password=").expect(400, {
                err: "Missing username or password!",
            });
        });
        it("should not perform login", async () => {
            new LdapConnection(ConfigUtil.getLdapConnectionSettings());
            await request(app)
                .post("/login")
                .send("username=cn=user01,ou=users,dc=example,dc=org")
                .send("password=password2")
                .expect(403);
        }).timeout(5000);
    });
});
