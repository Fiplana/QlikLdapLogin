import {before, describe, it} from "mocha";
import {expect} from "chai";
import {Logger} from "../src/utils/Logger";
import fs from "fs";
import path from "path";
import {QlikLdapLoginServiceHelper} from "./helper/QlikSenseLoginServiceHelper";
import nconf from "nconf";
import {ConfigUtil} from "../src/utils/ConfigUtil";

describe("QlikLdapLoginService", () => {
    before(() => {
        Logger.initialize();
    });

    describe("getTlsStartOptions", () => {
        const dirPath = path.join(process.cwd(), "getTlsStartOptions");
        before(() => {
            fs.mkdirSync(dirPath);
            fs.mkdirSync(path.join(dirPath, "unvalid"));
            ConfigUtil.setup();
        });
        after(() => {
            fs.rmdirSync(dirPath, {recursive: true});
        });

        beforeEach(() => {
            nconf.set("KEY_FILE_PATH", undefined);
            nconf.set("CERT_FILE_PATH", undefined);
        });
        it("should get undefined if CERT_FILE_PATH is undefined", () => {
            const fileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            nconf.set("KEY_FILE_PATH", path.join(dirPath, fileName));
            expect(QlikLdapLoginServiceHelper.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if KEY_FILE_PATH is undefined", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            nconf.set("CERT_FILE_PATH", path.join(dirPath, fileName));
            expect(QlikLdapLoginServiceHelper.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if CERT_FILE_PATH is invalid", () => {
            const fileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            nconf.set("KEY_FILE_PATH", path.join(dirPath, fileName));
            nconf.set("CERT_FILE_PATH", path.join(dirPath, "unvalid", fileName));
            expect(QlikLdapLoginServiceHelper.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if KEY_FILE_PATH is invalid", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            nconf.set("CERT_FILE_PATH", path.join(dirPath, fileName));
            nconf.set("KEY_FILE_PATH", path.join(dirPath, "unvalid", fileName));
            expect(QlikLdapLoginServiceHelper.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get TLSOptions on valid config", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            const keyFileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, keyFileName), "blabla");
            nconf.set("CERT_FILE_PATH", path.join(dirPath, fileName));
            nconf.set("KEY_FILE_PATH", path.join(dirPath, keyFileName));
            expect(QlikLdapLoginServiceHelper.getTlsStartOptions()).to.be.deep.equal({
                cert: fs.readFileSync(nconf.get("CERT_FILE_PATH")),
                key: fs.readFileSync(nconf.get("KEY_FILE_PATH")),
            });
        });
    });
});
