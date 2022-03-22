import BDDTest from '../bdd-test'
import Aggregate from '../aggregate'
import Event from '../event'
import Command from '../command'
import { OnlyTestWithAggregate, OnlyPrepositionWithEvents, OnlyActionWithCommands, CommandHandlerNotDefined } from "../exception"
import IHandleCommand from '../i-handle-command'

describe('BBD Test', () => {
    describe('constructor', () => {
        it('should instantiate with Aggregate subclass', () => {
            // given
            class mockAggregate extends Aggregate { }

            // when
            let bddTest = new BDDTest(mockAggregate);

            //then
            expect(bddTest).not.toBeNull()
        })

        it('should throw OnlyTestWithAggregate exception with non-Aggregate subclass', () => {
            // given
            class mockClass { }

            // when
            let testWithNonAggregate = () => new BDDTest(mockClass)

            // then
            expect(testWithNonAggregate).toThrow(OnlyTestWithAggregate);
        })
    })

    describe('Given', () => {
        class mockAggregate extends Aggregate { }
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        })

        it('should return array of provided Event subclass', () => {
            // given
            class mockEvent extends Event { }
            let mockEvent1 = new mockEvent();
            let mockEvent2 = new mockEvent();

            // when
            let givenEvents = bddTest.Given(mockEvent1, mockEvent2);

            // then
            expect(givenEvents).toEqual([mockEvent1, mockEvent2]);
        })

        it('should throw OnlyPrepositionWithEvents with non-Event subclass', () => {
            // given
            class mockClass { }
            class mockEvent extends Event { }
            let mockEvent1 = new mockEvent();
            let mockClass1 = new mockClass();

            // when
            let prepositionWithNonEvent = () => bddTest.Given(mockEvent1, mockClass1)

            // then
            expect(prepositionWithNonEvent).toThrow(OnlyPrepositionWithEvents);
        })
    })

    describe('When', () => {
        class handledCommand extends Command { };
        class superCommand extends Command { };
        class stubEvent extends Event { test = "Test" };
        class mockAggregate extends Aggregate implements IHandleCommand<handledCommand>, IHandleCommand<superCommand> {
            *Handle(c: handledCommand): Generator<Event, void, unknown> { yield new stubEvent() }
        };
        let bddTest: BDDTest<mockAggregate>;
        beforeEach(() => {
            bddTest = new BDDTest(mockAggregate);
        });

        it('should return command handler for Command subclass', () => {
            // given
            let command = new handledCommand();
            let event = new stubEvent();

            // when
            let commandHandler = bddTest.When(command);

            // then
            expect(commandHandler().next().value).toEqual(event);
        });

        it('should throw OnlyActionWithCommands with non-Command subclass', () => {
            // given
            class mockClass { }
            let mClass = new mockClass();

            // when
            let actionWithNonCommand = () => bddTest.When(mClass)

            // then
            expect(actionWithNonCommand).toThrow(OnlyActionWithCommands);
        });

        it('should throw CommandHandlerNotDefined with unhandled Command', () => {
            // given
            class unhandledCommand extends Command { };
            let unhandled = new unhandledCommand();

            // when
            let actionWithNonCommand = () => bddTest.When(unhandled)

            // then
            expect(actionWithNonCommand()().next().value).toThrow(CommandHandlerNotDefined);
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