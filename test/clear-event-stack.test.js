"use strict";

const describe = require("mocha").describe;
const expect = require("chai").expect;
const {clearEventStack, emitEvent} = require("../dist/index");

describe("clearEventStack function test", () => {
    it("should return an empty stack after events were published", () => {
        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {}}));

        expect(clearEventStack().length).to.equal(0);
    });
});
