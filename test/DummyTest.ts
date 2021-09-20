import { helloWorld } from "../src/index";
import { describe, it } from "mocha";
import { expect } from "chai";

describe("DummyTest", () => {

    it("Hello World", () => {
        expect(helloWorld()).to.be.equal("Hello World!");
    });
});