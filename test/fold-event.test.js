"use strict";

let expect = require("chai").expect;
let foldEvent = require("../dist/index").foldEvent;

describe("foldEvent function test", () => {
    it("should throw when no event name is given", () => {
        expect(foldEvent.bind({}, undefined))
            .to
            .throw("Must call foldEvent() with a valid event name.");
    });

    it("should throw when an event with an empty name is given", () => {
        expect(foldEvent.bind({}, ""))
            .to
            .throw("Must call foldEvent() with a valid event name.");
    });
});
