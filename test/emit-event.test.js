"use strict";

const {describe, beforeEach} = require("mocha");
const expect = require("chai").expect;
const {clearEventSnapshots, clearEventStack, emitEvent} = require("../dist/index");

describe("emitEvent function test", () => {
    const errorMessage = "Must call emitEvent() with a valid event name.";

    beforeEach(() => {clearEventStack(); clearEventSnapshots();});

    it("should throw when no event is given", () => {
        expect(emitEvent.bind({}, undefined)).to.throw(errorMessage);
    });

    it("should throw when an empty event is given", () => {
        expect(emitEvent.bind({}, {})).to.throw(errorMessage);
    });

    it("should throw when an event with an empty name is given", () => {
        expect(emitEvent.bind({}, {name: ""})).to.throw(errorMessage);
    });
});
