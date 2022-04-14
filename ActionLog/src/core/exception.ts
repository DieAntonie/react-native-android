import Command from "./command";

let toString = (events: Event[]) =>
  events.map(event => event.constructor.name).join(', ');

export class OnlyTestWithAggregate extends Error {
  constructor() {
    super("Only test with Aggregate subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyTestWithAggregate.prototype);
    this.name = 'OnlyTestWithAggregate';
  }
}

export class OnlyProposeWithEvents extends Error {
  constructor() {
    super("Only declare propositions with Event subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyProposeWithEvents.prototype);
    this.name = 'OnlyProposeWithEvents';
  }
}

export class OnlyExpectEvents extends Error {
  constructor() {
    super("Only expect Event subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyExpectEvents.prototype);
    this.name = 'OnlyExpectEvents';
  }
}

export class OnlyReceiveEvents extends Error {
  constructor() {
    super("Only receive Event subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyReceiveEvents.prototype);
    this.name = 'OnlyReceiveEvents';
  }
}

export class OnlyExpectErrors extends Error {
  constructor() {
    super("Only expect Error subclass exceptions");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyExpectErrors.prototype);
    this.name = 'OnlyExpectErrors';
  }
}

export class UnexpectedEventsReceived extends Error {
  constructor(...events: Event[]) {
    const eventList = toString(events);
    super(`Unexpected events [${eventList}] received`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnexpectedEventsReceived.prototype);
    this.name = 'UnexpectedEventsReceived';
  }
}

export class ExpectedEventsNotReceived extends Error {
  constructor(...events: Event[]) {
    const eventList = toString(events);
    super(`Expected events [${eventList}] not received`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExpectedEventsNotReceived.prototype);
    this.name = 'ExpectedEventsNotReceived';
  }
}

export class OnlyActionWithCommands extends Error {
  constructor() {
    super("Only action with Command subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyActionWithCommands.prototype);
    this.name = 'OnlyActionWithCommands';
  }
}

export class CommandHandlerNotDefined extends Error {
  constructor(command: Command) {
    super(`Command handler not defined for ${(command as any).name}`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CommandHandlerNotDefined.prototype);
    this.name = 'CommandHandlerNotDefined';
  }
}
