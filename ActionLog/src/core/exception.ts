import Command from "./command";

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