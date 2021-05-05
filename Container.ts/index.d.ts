import { Client, ClientEvents } from 'discord.js';
import { Constructable, ContainerModules } from '../src/type/Container';
import BaseEvent from '../src/entities/BaseEvent';
export default class Container<K extends keyof ClientEvents> {
    client: Client;
    events: Array<BaseEvent<any>>;
    register(module: ContainerModules, constructable: Constructable): void;
}
