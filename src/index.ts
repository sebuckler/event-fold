type EmittedEvent = {
    name: string;
    payload?: any;
};

type EventSubscription = {
    name: string;
    action: (payload: any) => void;
};

type StackedEvent = EmittedEvent & {
    id: number;
    timestamp: string;
};

type HubEventHandler = (payload?: any) => void;

type HubEvent = {
    name: string;
    handlers: HubEventHandler[];
};

let nextEventId = 0;
let eventHub = [] as HubEvent[];
let eventStack = [] as StackedEvent[];
let eventSnapshots = [] as StackedEvent[];

const isString = (value: any): boolean => typeof value === "string";
const pipe = <TIn extends any[], TOut = void>(fn1: any, fn2: any) =>
    (...args: TIn): TOut => fn2(fn1(...args));

const getNextEventId = (): number => ++nextEventId;

const validateEvent = (fnName: string, event: EmittedEvent | EventSubscription): void => {
    event == null || event.name == null || event.name === ""
        ? (() => {
            throw new Error(`Must call ${fnName}() with a valid event name.`);
        })()
        : !isString(event.name)
        ? (() => {
            throw new Error("Event name must be a string.");
        })()
        : (() => {
        })();
};

const stackEvent = (event: EmittedEvent): StackedEvent[] =>
    eventStack = [...eventStack, {...event, id: getNextEventId(), timestamp: new Date().toISOString()}];

const clearEventStack = (): StackedEvent[] => eventStack = [];

const clearEventSnapshots = (eventName?: string): StackedEvent[] =>
    eventName != null
        ? eventSnapshots = []
        : eventSnapshots = eventSnapshots.filter((snapshot) => snapshot.name !== eventName);

const callSubscribers = (event: EmittedEvent): void =>
    eventHub.filter((hubEvent) => hubEvent.name === event.name)
        .map((hubEvent) => hubEvent.handlers)
        .reduce((foldedFns, currFns) => [...foldedFns, ...currFns], [])
        .forEach((handler) => handler(event.payload));

const emitEvent = (event: EmittedEvent): void => {
    validateEvent("emitEvent", event);
    stackEvent(event);
    callSubscribers(event);
};

const getEventFromHub = (subscription: EventSubscription): HubEvent =>
    eventHub.filter((event) => event.name === subscription.name)[0];

const addEventToHub = (subscription: EventSubscription): HubEvent[] =>
    eventHub = [...eventHub, {name: subscription.name, handlers: [subscription.action]}];

const addHandlerToHubEvent = (subscription: EventSubscription): void => {
    const eventInHub = getEventFromHub(subscription);

    eventInHub.handlers = [...eventInHub.handlers, subscription.action];
};

const subscribeToEvent = (subscription: EventSubscription): void => {
    validateEvent("subscribeToEvent", subscription);

    getEventFromHub(subscription) != null
        ? addHandlerToHubEvent(subscription)
        : addEventToHub(subscription);
};

const getSortedPublishedEvents = (eventName: string): StackedEvent[] =>
    eventStack.filter((event) => event.name === eventName)
        .sort((prevEvent, currEvent) => prevEvent.id - currEvent.id);

const getPublishedEventsByName = (eventName: string): StackedEvent[] => {
    validateEvent("getPublishedEvents", {name: eventName});

    return getSortedPublishedEvents(eventName);
};

const getAllPublishedEvents = (): StackedEvent[] => eventStack;

const getPublishedEvents = (eventName?: string): StackedEvent[] =>
    eventName != null ? getPublishedEventsByName(eventName) : getAllPublishedEvents();

const getAllOtherSnapshots = (event: StackedEvent): [StackedEvent, StackedEvent[]] =>
    [event, eventSnapshots.filter((snapshot) => snapshot.name !== event.name)];

const updateEventSnapshots = ([event, snapshots]: [StackedEvent, StackedEvent[]]): StackedEvent[] =>
    eventSnapshots = [event, ...snapshots];

const snapshotEvent = pipe<StackedEvent[], StackedEvent[]>(getAllOtherSnapshots, updateEventSnapshots);

const foldPayload = (events: StackedEvent[]): any =>
    events.reduce((foldedPayload, currEvent) => ({...foldedPayload, ...currEvent.payload}), {} as StackedEvent);

const foldStackedEvents = ([snapshot, eventsToFold]: [StackedEvent, StackedEvent[]]): any => {
    snapshotEvent(snapshot);

    return foldPayload(eventsToFold);
};

const createFirstSnapshot = (eventName: string): StackedEvent[] =>
    eventSnapshots = [...eventSnapshots, getSortedPublishedEvents(eventName)[0]];

const getSnapshot = (eventName: string): StackedEvent => {
    const filteredSnapshots = eventSnapshots.filter((event) => event.name === eventName);

    return filteredSnapshots.length > 0
        ? filteredSnapshots[0]
        : createFirstSnapshot(eventName)[0];
};

const getEventsSinceSnapshot = (snapshot: StackedEvent): [StackedEvent, StackedEvent[]] =>
    [snapshot, eventStack.filter((event) => event.name === snapshot.name && event.id >= snapshot.id)
        .sort((prevEvent, currEvent) => prevEvent.id - currEvent.id)];

const getEventsToFold = pipe<string[], [StackedEvent, StackedEvent[]]>(getSnapshot, getEventsSinceSnapshot);

const foldEvent = (eventName: string): any => {
    validateEvent("foldEvent", {name: eventName});

    return eventStack.length > 0
        ? foldStackedEvents(getEventsToFold(eventName))
        : {};
};

export {
    EmittedEvent,
    EventSubscription,
    emitEvent,
    subscribeToEvent,
    getPublishedEvents,
    foldEvent,
    clearEventStack,
    clearEventSnapshots
};
