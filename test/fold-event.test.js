"use strict";

let expect = require("chai").expect;
let {foldEvent, emitEvent} = require("../dist/index");

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

    it("should return an empty object if no events are published", () => {
        expect(foldEvent("event"))
            .to
            .be
            .empty;
    });

    it("should return the payload of only one event being published", () => {
        const payload = {prop: "val"};

        emitEvent({name: "event", payload});

        expect(foldEvent("event").prop)
            .to
            .equal(payload.prop);
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

        expect(foldedEvent.prop)
            .to
            .equal("val2");

        expect(foldedEvent.otherProp)
            .to
            .equal("otherVal2");

        expect(foldedEvent.oneMoreProp)
            .to
            .equal("oneMoreVal");
    })
});