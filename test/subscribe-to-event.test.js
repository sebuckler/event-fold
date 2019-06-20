"use strict";

let expect = require("chai").expect;
let subscribeToEvent = require("../dist/index").subscribeToEvent;

describe("subscribeToEvent function test", () => {
    it("should throw when no event name is given", () => {
        expect(subscribeToEvent.bind({}, undefined))
            .to
            .throw("Must call subscribeToEvent() with a valid event name.");
    });

    it("should throw when an empty event is given", () => {
        expect(subscribeToEvent.bind({}, {}))
            .to
            .throw("Must call subscribeToEvent() with a valid event name.");
    });

    it("should throw when an event with an empty name is given", () => {
        expect(subscribeToEvent.bind({}, {name: ""}))
            .to
            .throw("Must call subscribeToEvent() with a valid event name.");
    });
});
