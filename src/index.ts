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
};

type HubEventHandler = (payload?: any) => void;

type HubEvent = {
    name: string;
    handlers: HubEventHandler[];
};

type EventHub = HubEvent[];

type EventStack = StackedEvent[];

let nextEventId = Date.now();
let eventHub = [] as EventHub;
let eventStack = [] as EventStack;

const getNextEventId = (): number => ++nextEventId;

const validateEvent = (fnName: string, event: EmittedEvent | EventSubscription): void => {
    if (event == null || event.name == null || event.name === "") {
        throw new Error(`Must call ${fnName}() with a valid event name.`);
    }
};

const stackEvent = (event: EmittedEvent): EventStack =>
    eventStack = [...eventStack, {...event, id: getNextEventId()}];

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

const addEventToHub = (subscription: EventSubscription): EventHub =>
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

const foldEvent = (name: string): any => {
    validateEvent("foldEvent", {name});

    return eventStack.filter((event) => event.name === name)
        .sort((prevEvent, currEvent) => prevEvent.id - currEvent.id)
        .reduce((foldedPayload, currEvent) => ({...foldedPayload, ...currEvent.payload}), {} as StackedEvent);
};

export {
    EmittedEvent,
    EventSubscription,
    emitEvent,
    subscribeToEvent,
    foldEvent
};
