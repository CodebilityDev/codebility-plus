// apps/bot/events/messageCreate.ts
import { Events, Client, Message } from "discord.js";
import { handleXP } from "../utils/xpSystem";

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message, client: Client) {
    // Ignore bots and DMs
    if (message.author.bot || !message.guild) return;

    try {
      // Handle XP system (all logic is now in xpSystem.ts)
      await handleXP(message);
    } catch (error) {
      console.error("🔥 messageCreate event error:", error);
    }
  },
};