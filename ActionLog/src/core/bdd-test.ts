import Aggregate from "./aggregate";
import Command from "./command";
import Event from "./event";
import { OnlyTestWithAggregate, OnlyPrepositionWithEvents, OnlyActionWithCommands } from "./exception"
import IHandleCommand from "./i-handle-command";

class BDDTest<TAggregate extends Aggregate> {

    private sut: TAggregate;

    constructor(aggregate: new () => TAggregate) {
        let agg = new aggregate();
        if (!(agg instanceof Aggregate)) {
            throw new OnlyTestWithAggregate();
        }
        this.sut = agg;
    }

    Given(...events: Event[]): Event[] {
        if (events.some(e => !(e instanceof Event))) {
            throw new OnlyPrepositionWithEvents();
        }
        return events;
    }

    When(command: Command): () => Generator<Event, void, unknown> {
        if (!(command instanceof Command)) {
            throw new OnlyActionWithCommands();
        }
        let commandHandler = () => {
            try {
                return this.dispatchCommand(command);
            } catch (error: any) {
                return error
            }
        }
        return commandHandler;
    }

    private dispatchCommand<TCommand>(command: TCommand): Generator<Event, void, unknown> {
        let handler = (this.sut as unknown) as IHandleCommand<TCommand>;
        if (handler == null) {
            throw new Error("FILL ME");
        }
        type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
        let TestArguments = handler.Handle.toString();
        console.log(TestArguments);
        return handler.Handle(command);
    }
}

export default BDDTest;
