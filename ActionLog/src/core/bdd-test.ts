import Aggregate from "./aggregate";
import Command from "./command";
import Event from "./event";
import { OnlyTestWithAggregate, OnlyPrepositionWithEvents, OnlyActionWithCommands, CommandHandlerNotDefined } from "./exception"

class BDDTest<TAggregate extends Aggregate> {

    private _aggregate : TAggregate;

    constructor(aggregate: new () => TAggregate) {
        let agg = new aggregate();
        if (!(agg instanceof Aggregate)) {
            throw new OnlyTestWithAggregate();
        }
        this._aggregate = agg;
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
        if (!this._aggregate.handles(command)) {
            throw new CommandHandlerNotDefined(command);
        }
        let commandHandler = () => {
            try {
                return this._aggregate.Handle(command);
            } catch (error: any) {
                return error
            }
        }
        return commandHandler;
    }
}

export default BDDTest;
