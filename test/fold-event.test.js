"use strict";

const describe = require("mocha").describe;
const expect = require("chai").expect;
const {foldEvent, emitEvent} = require("../dist/index");

describe("foldEvent function test", () => {
    const errorMessage = "Must call foldEvent() with a valid event name.";
    const expectToBeEmpty = (value) => expect(value).to.be.empty;

    it("should throw when no event name is given", () => {
        expect(foldEvent.bind({}, undefined)).to.throw(errorMessage);
    });

    it("should throw when an event with an empty name is given", () => {
        expect(foldEvent.bind({}, "")).to.throw(errorMessage);
    });

    it("should return an empty object if no events are published", () => {
        expectToBeEmpty(foldEvent("event"));
    });

    it("should return the payload of only one event being published", () => {
        const payload = {prop: "val"};

        emitEvent({name: "event", payload});

        expect(foldEvent("event").prop).to.equal(payload.prop);
    });

    it("should return a right-associative merge of all published event payloads in order of creation", () => {
        const events = [
            {name: "event", payload: {prop: "val"}},
            {name: "event", payload: {prop: "val2"}},
            {name: "event", payload: {otherProp: "otherVal"}},
            {name: "event", payload: {otherProp: "otherVal2"}},
            {name: "event", payload: {oneMoreProp: "oneMoreVal"}}
        ];

        events.forEach((event) => emitEvent(event));

        const foldedEvent = foldEvent("event");

        expect(foldedEvent.prop).to.equal("val2");
        expect(foldedEvent.otherProp).to.equal("otherVal2")
        expect(foldedEvent.oneMoreProp).to.equal("oneMoreVal");
    })
});
