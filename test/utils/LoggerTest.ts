import {describe, it} from "mocha";
import {expect} from "chai";
import {Logger} from "../../src/utils/Logger";
import BunyanLogger from "bunyan";

/**
 * Just a helper class to reset the logger for each test.
 */
class TestLogger extends Logger {
    /**
     * Resets the logger.
     */
    public static reset(): void {
        Logger.instance = undefined;
    }
}

describe("utils", () => {
    describe("Logger", () => {
        beforeEach(() => {
            TestLogger.reset();
        });
        describe("getLogger", () => {
            it("should throw on uninitialized logger", () => {
                expect(function () {
                    Logger.getLogger();
                }).to.throw("Logger not initialized!");
            });
            it("should get initializied logger", () => {
                Logger.initialize();
                expect(Logger.getLogger()).to.be.instanceOf(BunyanLogger);
            });
        });
    });
});
