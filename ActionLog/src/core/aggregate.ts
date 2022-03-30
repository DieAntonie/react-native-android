import Command from "./command";
import Event from "./event";

interface IAggregate {
    commands : Command[];
}
class Aggregate implements IAggregate {
    commands: Command[] = [];
    *Handle<TCommand>(command: TCommand): Generator<Event, void, unknown> {
        throw new Error("Method not implemented.");
    }
    handles<TCommand>(command: TCommand) {
        let handles = this.commands.some(
            c => c.name === command.constructor.name &&
            Reflect.has(this, `handle${command.constructor.name}`)
        );
        return handles;
    }
}
export default Aggregate