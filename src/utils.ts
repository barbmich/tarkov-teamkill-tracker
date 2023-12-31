import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import path from "path";
import fs from "fs/promises";

export const CWD = process.cwd();
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const getCommands = async () => {
    const commandsFolder = path.resolve(CWD, "src", "scripts", "commands");

    const commands: SlashCommandBuilder[] = [];
    for (const file of await fs.readdir(commandsFolder)) {
        console.log("importing " + file);
        const command = await import(path.resolve(commandsFolder, file));
        commands.push(command.default.command);
    }

    return commands;
};

export const getHandler = async (handlerName: string) => {
    const handler = await import(
        path.resolve(CWD, "src", "scripts", "commands", handlerName)
    );
    return handler.default.handler;
};

export interface ICommand {
    name: string;
    description: string;
    command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class Command implements ICommand {
    name: string;
    description: string;
    command: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
    constructor({
        name,
        description,
        command,
        handler,
    }: {
        name: string;
        description: string;
        command: Omit<
            SlashCommandBuilder,
            "addSubcommand" | "addSubcommandGroup"
        >;
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
    }) {
        this.name = name;
        this.description = description;
        this.command = command;
        this.handler = handler;

        this.command.setName(this.name);
        this.command.setDescription(this.description);
    }
}
