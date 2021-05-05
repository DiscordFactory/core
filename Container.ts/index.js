"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Container {
    constructor() {
        this.client = new discord_js_1.Client();
        this.events = [];
    }
    register(module, constructable) {
        this[module].push(constructable);
    }
}
exports.default = Container;
