import BDDTest from '../bdd-test'
import Aggregate from '../aggregate'
import Event from '../event'
import Command from '../command'
import { OnlyTestWithAggregate, OnlyProposeWithEvents, OnlyActionWithCommands, CommandHandlerNotDefined, OnlyExpectEvents, OnlyReceiveEvents } from "../exception"

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

        it('should throw OnlyExpectEvents with non-Event subclass', () => {
            // given
            class mockClass { };
            let mClass = new mockClass();

            // when
            let expectWithNonEvent = () => bddTest.Then(mClass);

            // then
            expect(expectWithNonEvent).toThrow(OnlyExpectEvents);
        });

        it('should return event handler with expected Event for produced Event', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            let receivedEvent = new ExpectedEvent();

            // when
            let expectedEventHandler = bddTest.Then(expectedEvent);

            // then
            expectedEventHandler(receivedEvent);
        });

        it('should throw OnlyReceiveEvents for produced Events', () => {
            // given
            let expectedEvent = new ExpectedEvent();
            class mockClass { };
            let mClass = new mockClass();
            let eventHandler = bddTest.Then(expectedEvent);

            // when
            let handleReceivedNonEvent = () => eventHandler(mClass);

            // then
            expect(handleReceivedNonEvent).toThrow(OnlyReceiveEvents);
        });
    });

    // describe('Create method', () => {
    //     it('should create and return an object of ingredient details', async () => {
    //         const payload = {
    //             name: 'Pasta',
    //             slug: 'pasta',
    //             description: 'abcd make some pasta'
    //         }

    //         const ingredient = await ingredientDal.create(payload)
    //         expect(ingredient).not.toBeNull()
    //     })
    // })

    // describe('findOrCreate method', () => {
    //     beforeAll(async () => {
    //         await Ingredient.create({
    //             name: 'Brown Rice',
    //             slug: 'brown-rice'
    //         })
    //     })
    //     it('should create a new entry when none with matching name exists', async () => {
    //         const payload = {
    //             name: 'Rice',
    //             slug: 'rice',
    //         }
    //         await ingredientDal.findOrCreate(payload)
    //         const ingredientsFound = await Ingredient.findAll({where: {name: 'Rice'}})
    //         expect(ingredientsFound.length).toEqual(1)
    //     })
    //     it('should return an existing entry where one with same name exists without updating it', async () => {
    //         const payload = {
    //             name: 'Brown Rice',
    //             slug: 'brownrice',
    //             description: 'test'
    //         }
    //         await ingredientDal.findOrCreate(payload)
    //         const ingredientsFound = await Ingredient.findAll({where: {name: 'Brown Rice'}})

    //         expect(ingredientsFound.length).toEqual(1)
    //         expect(ingredientsFound[0].slug).toEqual('brown-rice')
    //         expect(ingredientsFound[0].description).toBeNull()
    //     })
    // })

    // describe('Update method', () => {
    //     it('should update a specific existing Ingredient entry', async () => {
    //         await ingredientDal.update(ingredientId, {
    //             description: 'A legume'
    //         })
    //         const ingredient = await Ingredient.findByPk(ingredientId)
    //         expect(ingredient?.description).toEqual('A legume')
    //     })
    // })
})