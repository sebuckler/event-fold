"use strict";

const {describe, beforeEach} = require("mocha");
const expect = require("chai").expect;
const {clearEventSnapshots, clearEventStack, getPublishedEvents, emitEvent} = require("../dist/index");

describe("getPublishedEvents function test", () => {
    beforeEach(() => {clearEventStack(); clearEventSnapshots();});

    it("should throw when provided event name is not a string", () => {
        expect(getPublishedEvents.bind({}, {})).to.throw("Event name must be a string.");
        expect(getPublishedEvents.bind({}, [])).to.throw("Event name must be a string.");
        expect(getPublishedEvents.bind({}, true)).to.throw("Event name must be a string.");
        expect(getPublishedEvents.bind({}, 1)).to.throw("Event name must be a string.");
    });

    it("should throw when provided event name is an empty string", () => {
        expect(getPublishedEvents.bind({}, "")).to.throw("Must call getPublishedEvents() with a valid event name.");
    });

    it("should return all published events when no event name is given", () => {
        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {}}));
        [1, 2, 3].forEach(() => emitEvent({name: "otherEvent", payload: {}}));

        expect(getPublishedEvents().length).to.equal(6);
    });

    it("should return only published events for the event name provided", () => {
        [1, 2, 3].forEach(() => emitEvent({name: "event", payload: {}}));
        [1, 2, 3].forEach(() => emitEvent({name: "otherEvent", payload: {}}));

        const publishedEvents = getPublishedEvents("event");

        expect(publishedEvents.length).to.equal(3);

        publishedEvents.forEach((event) => {
            expect(event.name).to.equal("event");
        });
    });
});
