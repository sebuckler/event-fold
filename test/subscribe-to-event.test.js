"use strict";

const describe = require("mocha").describe;
const expect = require("chai").expect;
const {subscribeToEvent, emitEvent} = require("../dist/index");

describe("subscribeToEvent function test", () => {
    const errorMessage = "Must call subscribeToEvent() with a valid event name.";

    it("should throw when no event name is given", () => {
        expect(subscribeToEvent.bind({}, undefined)).to.throw(errorMessage);
    });

    it("should throw when an empty event is given", () => {
        expect(subscribeToEvent.bind({}, {})).to.throw(errorMessage);
    });

    it("should throw when an event with an empty name is given", () => {
        expect(subscribeToEvent.bind({}, {name: ""})).to.throw(errorMessage);
    });

    it("should call event subscription action for the named published event", () => {
        let emittedPayloads = [];

        subscribeToEvent({name: "event", action: (payload) => emittedPayloads.push(payload)});

        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {prop: "val"}}));

        expect(emittedPayloads.length).to.equal(3);
    });

    it("should call event subscription action for the named published event", () => {
        let emittedPayloads = [];

        subscribeToEvent({name: "event", action: (payload) => emittedPayloads.push(payload)});

        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {prop: "val"}}));

        expect(emittedPayloads.length).to.equal(3);

        emittedPayloads.forEach((payload) => {
            expect(payload.prop).to.equal("val");
        });
    });

    it("should not call event subscription action when other events are published", () => {
        let emittedPayloads = [];

        subscribeToEvent({name: "event", action: (payload) => emittedPayloads.push(payload)});

        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {prop: "val"}}));

        emitEvent({name: "otherEvent", payload: {prop: "otherVal"}});

        expect(emittedPayloads.length).to.equal(3);

        emittedPayloads.forEach((payload) => {
            expect(payload.prop).to.equal("val");
        });
    });
});
