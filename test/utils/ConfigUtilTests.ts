import {describe, it} from "mocha";
import {expect} from "chai";
import {ConfigUtil} from "../../src/utils/ConfigUtil";

describe("utils", () => {
    describe("ConfigUtils", () => {
        describe("getQpsUri()", () => {
            it("should return the default QPS URI", () => {
                expect(ConfigUtil.getQpsUri()).to.equal(
                    "https://qlikserver.example.org:4243/qps/customVirtualProxyPrefix",
                );
            });
        });
        describe("getClientPfx()", () => {
            it("should not find the client.pfx", () => {
                try {
                    ConfigUtil.getClientPfx();
                    throw new Error("should not find the client.pfx");
                } catch (err) {
                    if (!(err instanceof Error)) {
                        throw new Error("Error has wrong instance");
                    }
                    // eslint-disable-next-line no-unused-expressions
                    expect(err.message.startsWith("Could not find the certificate")).to.be.true;
                }
            });
        });
    });
});
