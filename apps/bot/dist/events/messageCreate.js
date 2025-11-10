"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/bot/events/messageCreate.ts
const discord_js_1 = require("discord.js");
const xpSystem_1 = require("../utils/xpSystem");
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    async execute(message, client) {
        // Ignore bots and DMs
        if (message.author.bot || !message.guild)
            return;
        try {
            // Handle XP system (all logic is now in xpSystem.ts)
            await (0, xpSystem_1.handleXP)(message);
        }
        catch (error) {
            console.error("🔥 messageCreate event error:", error);
        }
    },
};
