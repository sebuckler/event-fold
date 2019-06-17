# event-fold
A lightweight, FP-inspired event sourcing implementation for JavaScript

## Installation
```sh
npm install event-fold --save 
```

## Usage

### JavaScript

```javascript
var subscribeToEvent = require("event-fold").subscribeToEvent;
var emitEvent = require("event-fold").emitEvent;
var foldEvent = require("event-fold").foldEvent;

/*
 * Subscribe to any event by name, providing a callback to be run when an event of the same name is emitted.
 * 
 * Subscribing to an event will create the event in an event hub.
 * Subsequent calls to subscribeToEvent() will not create new events in the event hub.
 * Each callback for the same event names will be pushed to an array of handlers for that event.
 */
subscribeToEvent("increment", (payload) => console.log(payload));

/*
 * Publish an event by name, providing an optional payload object.
 * 
 * Each event published will be pushed to an event stack, representing the event's history.
 * An event ID will be attached to the published event on the stack for sorting during an event fold.
 * Each callback registered for the named event will be called sequentially.
 */
emitEvent("increment", {count: 0});
emitEvent("increment", {count: 1, otherProp: "value"});
emitEvent("increment", {count: 2});

/*
 * When you want the current "state" for a given event, you can fold that event's stack.
 * 
 * This will fold (reduce) the named event's stack down to a single object.
 * A right-associative merge of the event's payloads is used to determine the current state for that event.
 */
var state = foldEvent("increment");
```
```sh
state should be {count: 2, otherProp: "value"}
```

### TypeScript
```typescript
import {subscribeToEvent, emitEvent, foldEvent} from "event-fold";

subscribeToEvent("increment", (payload) => console.log(payload));

emitEvent("increment", {count: 0});
emitEvent("increment", {count: 1, otherProp: "value"});
emitEvent("increment", {count: 2});

let state = foldEvent("increment");
```

## Test
```sh
npm run test
```
