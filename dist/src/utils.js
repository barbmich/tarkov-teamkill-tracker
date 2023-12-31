import path from "path";
import fs from "fs/promises";
export const CWD = process.cwd();
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const getCommands = async () => {
    const commandsFolder = path.resolve(CWD, "src", "scripts", "commands");
    const commands = [];
    for (const file of await fs.readdir(commandsFolder)) {
        console.log("importing " + file);
        const command = await import(path.resolve(commandsFolder, file));
        commands.push(command.default.command);
    }
    return commands;
};
export const getHandler = async (handlerName) => {
    const handler = await import(path.resolve(CWD, "src", "scripts", "commands", handlerName));
    return handler.default.handler;
};
export class Command {
    name;
    description;
    command;
    handler;
    constructor({ name, description, command, handler, }) {
        this.name = name;
        this.description = description;
        this.command = command;
        this.handler = handler;
        this.command.setName(this.name);
        this.command.setDescription(this.description);
    }
}
//# sourceMappingURL=utils.js.map