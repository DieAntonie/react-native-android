export class OnlyTestWithAggregate extends Error {
  constructor() {
    super("Only test with Aggregate subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyTestWithAggregate.prototype);
    this.name = 'OnlyTestWithAggregate';
  }
}

export class OnlyPrepositionWithEvents extends Error {
  constructor() {
    super("Only pre-position with Event subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OnlyPrepositionWithEvents.prototype);
    this.name = 'OnlyPrepositionWithEvents';
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
  constructor() {
    super("Only action with Command subclass");
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CommandHandlerNotDefined.prototype);
    this.name = 'CommandHandlerNotDefined';
  }
}