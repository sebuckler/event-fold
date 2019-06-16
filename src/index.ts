type EmittedEvent = {
    name: string;
    payload: any;
};

type EventSubscription = {
    name: string;
    action: (payload: any) => void;
};

type StackedEvent = EmittedEvent & {
    id: number;
};

type HubEventHandler = (payload: any) => void;

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

const stackEvent = (event: EmittedEvent): StackedEvent[] =>
    eventStack = [...eventStack, {...event, id: getNextEventId()}];

const callSubscribers = (event: EmittedEvent): void =>
    eventHub.filter((hubEvent) => hubEvent.name === event.name)
        .map((hubEvent) => hubEvent.handlers)
        .reduce((foldedFns, currFns) => [...foldedFns, ...currFns], [])
        .forEach((handler) => handler(event.payload));

const emitEvent = (event: EmittedEvent): void => {
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

const subscribeToEvent = (subscription: EventSubscription) => {
    getEventFromHub(subscription) != null
        ? addHandlerToHubEvent(subscription)
        : addEventToHub(subscription);
};

const foldEvent = (name: string): any =>
    eventStack.filter((event: StackedEvent) => event.name === name)
        .sort((a: StackedEvent, b: StackedEvent) => a.id - b.id)
        .reduce((foldedEvent: StackedEvent, currEvent: StackedEvent) =>
            ({...foldedEvent.payload, ...currEvent.payload}), {} as StackedEvent);

export {
    EmittedEvent,
    EventSubscription,
    emitEvent,
    subscribeToEvent,
    foldEvent
};
