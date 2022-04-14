import BDDTest from '../bdd-test'
import Aggregate from '../aggregate'
import Event from '../event'
import Command from '../command'
import {
    OnlyTestWithAggregate,
    OnlyProposeWithEvents,
    OnlyActionWithCommands,
    CommandHandlerNotDefined,
    OnlyExpectEvents,
    OnlyReceiveEvents,
    UnexpectedEventsReceived,
    ExpectedEventsNotReceived,
    OnlyExpectErrors
} from "../exception"

describe('BBD Test', () => {
    describe('constructor', () => {
        it('should instantiate with Aggregate subclass', () => {
            // given
            class mockAggregate extends Aggregate { };

            // when
            let bddTest = new BDDTest(mockAggregate);

            //then
            expect(bddTest).not.toBeNull();
        });

        it('should throw OnlyTestWithAggregate exception with non-Aggregate subclass', () => {
            // given
            class mockClass { };

            // when
            let testWithNonAggregate = () => new BDDTest(mockClass);

            // then
            expect(testWithNonAggregate).toThrow(OnlyTestWithAggregate);
        });
    });

    describe('Given', () => {
        class mockAggregate extends Aggregate { };
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        });

        it('should return array of provided Event subclass', () => {
            // given
            class mockEvent extends Event { };
            let mockEvent1 = new mockEvent();
            let mockEvent2 = new mockEvent();

            // when
            let givenEvents = bddTest.Given(mockEvent1, mockEvent2);

            // then
            expect(givenEvents).toEqual([mockEvent1, mockEvent2]);
        });

        it('should throw OnlyProposeWithEvents with non-Event subclass', () => {
            // given
            class mockClass { };
            class mockEvent extends Event { };
            let mockEvent1 = new mockEvent();
            let mockClass1 = new mockClass();

            // when
            let prepositionWithNonEvent = () => bddTest.Given(mockEvent1, mockClass1);

            // then
            expect(prepositionWithNonEvent).toThrow(OnlyProposeWithEvents);
        });
    });

    describe('When', () => {
        class HandledCommand extends Command { };
        class stubEvent extends Event { test = "Test" };
        class mockAggregate extends Aggregate {
            override handlers: Map<Command, Function> = new Map([[HandledCommand, () => new stubEvent()]]);
        };
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        });

        it('should return command handler for Command subclass', () => {
            // given
            let command = new HandledCommand();
            let event = new stubEvent();

            // when
            let commandHandler = bddTest.When(command);

            // then
            expect(commandHandler().next().value).toEqual(event);
        });

        it('should throw OnlyActionWithCommands with non-Command subclass', () => {
            // given
            class mockClass { };
            let mClass = new mockClass();

            // when
            let actionWithNonCommand = () => bddTest.When(mClass);

            // then
            expect(actionWithNonCommand).toThrow(OnlyActionWithCommands);
        });

        it('should throw CommandHandlerNotDefined with unhandled Command', () => {
            // given
            class unhandledCommand extends Command { };
            let unhandled = new unhandledCommand();

            // when
            let actionWithUnhandledCommand = () => bddTest.When(unhandled);

            // then
            expect(actionWithUnhandledCommand).toThrow(CommandHandlerNotDefined);
        });
    });

    describe('Then', () => {
        class HandledCommand extends Command { };
        class ExpectedEvent extends Event { };
        class mockAggregate extends Aggregate {
            override handlers: Map<Command, Function> = new Map([[HandledCommand, () => new ExpectedEvent()]]);
        };
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        });

        it('should return event handler with expected Event for produced Event', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            let receivedEvent = new ExpectedEvent();

            // when
            let expectedEventHandler = bddTest.Then(...[expectedEvent]);

            // then
            expectedEventHandler(receivedEvent);
        });

        it('should throw OnlyExpectEvents with non-Event subclass', () => {
            // given
            class mockClass { };
            let mClass = new mockClass();

            // when
            let expectWithNonEvent = () => bddTest.Then(mClass);

            // then
            expect(expectWithNonEvent).toThrow(OnlyExpectEvents);
        });

        it('should throw OnlyReceiveEvents for produced Events', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            class mockClass { };
            let mClass = new mockClass();
            let eventHandler = bddTest.Then(expectedEvent);

            // when
            let handleReceivedNonEvent = () => eventHandler(...[mClass]);

            // then
            expect(handleReceivedNonEvent).toThrow(OnlyReceiveEvents);
        });

        it('should throw ExpectedEventsNotReceived for produced Events', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            class UnexpectedEvent extends Event { };
            let unexpectedEvent = new UnexpectedEvent();
            let eventHandler = bddTest.Then(expectedEvent, unexpectedEvent);

            // when
            let handleReceivedNonEvent = () => eventHandler(expectedEvent);

            // then
            expect(handleReceivedNonEvent).toThrow(ExpectedEventsNotReceived);
        });

        it('should throw UnexpectedEventsReceived for produced Events', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            class UnexpectedEvent extends Event { };
            let unexpectedEvent = new UnexpectedEvent();
            let eventHandler = bddTest.Then(expectedEvent);

            // when
            let handleReceivedNonEvent = () => eventHandler(unexpectedEvent, expectedEvent);

            // then
            expect(handleReceivedNonEvent).toThrow(UnexpectedEventsReceived);
        });

        // it('should throw fail assert for differing Events', () => {
        //     // given
        //     class MockEvent extends Event { mockProp = 'mockValue' };
        //     let expectedEvent = new MockEvent();
        //     let eventHandler = bddTest.Then(expectedEvent);

        //     // when
        //     let receivedEvent = new MockEvent();
        //     receivedEvent.mockProp = 'wrong';

        //     // then
        //     eventHandler(receivedEvent);
        // });
    });

    describe('ThenFailWith', () => {
        class HandledCommand extends Command { };
        class ExpectedEvent extends Event { };
        class ExpectedException extends Error { };
        class mockAggregate extends Aggregate {
            override handlers: Map<Command, Function> = new Map([[HandledCommand, () => new ExpectedEvent()]]);
        };
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        });

        it('should return event handler with expected Event for produced Event', () => {
            // given
            let expectedException = new ExpectedException();

            // when
            let expectedEventHandler = bddTest.ThenFailWith(ExpectedException);

            // then
            expectedEventHandler(...[expectedException]);
        });

        it('should throw OnlyExpectErrors with non-Error subclass', () => {
            // given
            class mockClass { };

            // when
            let expectWithNonEvent = () => bddTest.ThenFailWith(mockClass);

            // then
            expect(expectWithNonEvent).toThrow(OnlyExpectErrors);
        });

        it('should throw OnlyExpectErrors with non-Error subclass', () => {
            // given
            class mockClass { };

            // when
            let expectWithNonEvent = () => bddTest.ThenFailWith(mockClass);

            // then
            expect(expectWithNonEvent).toThrow(OnlyExpectErrors);
        });
    });
})
