import Command from "./command";

interface IHandleCommand {
    handlers: Map<Command, Function>
}
export default IHandleCommand