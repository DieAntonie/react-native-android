import Command from "./command";
import Event from "./event";
import { CommandHandlerNotDefined } from "./exception";
import IHandleCommand from "./i-handle-command";

class Aggregate implements IHandleCommand {
    handlers: Map<Command, Function> = new Map();
    *Handle<TCommand>(command: TCommand): Generator<Event, void, unknown> {
        let commandHandler = this.handlers.get((command as any).constructor);
        if (!commandHandler) {
            throw new CommandHandlerNotDefined((command as any).constructor);
        }
        return commandHandler(command)
    }

    handles<TCommand>(command: TCommand): boolean {
        return this.handlers.has((command as any).constructor)
    }
}
export default Aggregate