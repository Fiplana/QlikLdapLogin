import {before, describe, it} from "mocha";
import {expect} from "chai";
import {Logger} from "../src/utils/Logger";
import {QlikLdapLoginService} from "../src/QlikLdapLoginService";
import fs from "fs";
import path from "path";

describe("QlikLdapLoginService", () => {
    before(() => {
        Logger.initialize();
    });
    describe("getPort", () => {
        it("should get port from env var", () => {
            process.env.SERVER_PORT = "12345";
            expect(QlikLdapLoginService.getPort()).to.be.equal(parseInt(process.env.SERVER_PORT));
        });
        it("should return default port on undefined env var", () => {
            process.env.SERVER_PORT = undefined;
            expect(QlikLdapLoginService.getPort()).to.be.equal(QlikLdapLoginService.defaultServicePort);
        });
        it("should return default port on NaN env var", () => {
            process.env.SERVER_PORT = "test";
            expect(QlikLdapLoginService.getPort()).to.be.equal(QlikLdapLoginService.defaultServicePort);
        });
    });

    describe("getTlsStartOptions", () => {
        const dirPath = path.join(process.cwd(), "getTlsStartOptions");
        before(() => {
            fs.mkdirSync(dirPath);
            fs.mkdirSync(path.join(dirPath, "unvalid"));
        });
        after(() => {
            fs.rmdirSync(dirPath, {recursive: true});
        });

        beforeEach(() => {
            process.env.KEY_FILE_PATH = undefined;
            process.env.CERT_FILE_PATH = undefined;
        });
        it("should get undefined if CERT_FILE_PATH is undefined", () => {
            const fileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            process.env.KEY_FILE_PATH = path.join(dirPath, fileName);
            expect(QlikLdapLoginService.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if KEY_FILE_PATH is undefined", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            process.env.CERT_FILE_PATH = path.join(dirPath, fileName);
            expect(QlikLdapLoginService.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if CERT_FILE_PATH is invalid", () => {
            const fileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            process.env.KEY_FILE_PATH = path.join(dirPath, fileName);
            process.env.CERT_FILE_PATH = path.join(dirPath, "unvalid", fileName);
            expect(QlikLdapLoginService.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get undefined if KEY_FILE_PATH is invalid", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            process.env.CERT_FILE_PATH = path.join(dirPath, fileName);
            process.env.KEY_FILE_PATH = path.join(dirPath, "unvalid", fileName);
            expect(QlikLdapLoginService.getTlsStartOptions()).to.be.equal(undefined);
        });
        it("should get TLSOptions on valid config", () => {
            const fileName = "CERT_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, fileName), "blabla");
            const keyFileName = "Key_" + Date.now() + ".pem";
            fs.writeFileSync(path.join(dirPath, keyFileName), "blabla");
            process.env.CERT_FILE_PATH = path.join(dirPath, fileName);
            process.env.KEY_FILE_PATH = path.join(dirPath, keyFileName);
            expect(QlikLdapLoginService.getTlsStartOptions()).to.be.deep.equal({
                cert: fs.readFileSync(process.env.CERT_FILE_PATH),
                key: fs.readFileSync(process.env.KEY_FILE_PATH),
            });
        });
    });
});
