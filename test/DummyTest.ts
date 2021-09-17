import {describe, it} from "mocha";
import {expect} from "chai";

describe("DummyTest", () => {
    it("Hello World", () => {
        expect("Hello World!").to.be.equal("Hello World!");
    });
});
