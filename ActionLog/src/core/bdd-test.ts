import Aggregate from "./aggregate";
import Command from "./command";
import Event from "./event";
import { OnlyTestWithAggregate, OnlyProposeWithEvents, OnlyActionWithCommands, CommandHandlerNotDefined, OnlyExpectEvents, OnlyReceiveEvents } from "./exception"

class BDDTest<TAggregate extends Aggregate> {

    private _aggregate : TAggregate;

    constructor(aggregate: new () => TAggregate) {
        let agg = new aggregate();
        if (!(agg instanceof Aggregate)) {
            throw new OnlyTestWithAggregate();
        }
        this._aggregate = agg;
    }

    Given(...proposedEvents: Event[]): Event[] {
        if (proposedEvents.some(e => !(e instanceof Event))) {
            throw new OnlyProposeWithEvents();
        }
        return proposedEvents;
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

    Then(...expectedEvents: Event[]) {
        if (expectedEvents.some(e => !(e instanceof Event))) {
            throw new OnlyExpectEvents();
        }
        let eventHandler = (...receivedEvents: Event[]) => {
            if (receivedEvents.some(e => !(e instanceof Event))) {
                throw new OnlyReceiveEvents();
            }
            
            expect(receivedEvents).toEqual(expectedEvents);
        }
        return eventHandler;
    }
}

export default BDDTest;
