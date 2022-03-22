import Event from "./event";

interface IHandleCommand<TCommand>
{
    Handle(c: TCommand): Generator<Event, void, unknown>;
}
export default IHandleCommand