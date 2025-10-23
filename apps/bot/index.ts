// apps/bot/index.ts
import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Collection,
} from "discord.js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { handleXP } from "./utils/xpSystem";

// =============================
// ✅ Load environment variables reliably
// =============================
const envPath =
  process.env.ENV_PATH ||
  path.resolve(process.cwd(), ".env"); // Load from current working directory

if (!fs.existsSync(envPath)) {
  console.warn(`⚠️ .env file not found at ${envPath}. Environment variables may be missing.`);
}

dotenv.config({ path: envPath });

// =============================
// 🔹 Extend Client to include command collection
// =============================
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
  }
}

(async () => {
  // --- Initialize Discord client ---
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.commands = new Collection();

  // =============================
  // 🔹 LOAD ALL COMMANDS
  // =============================
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(
      (file) =>
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".disabled")
    );

  const commandsData: any[] = [];

  for (const file of commandFiles) {
    try {
      const commandModule = await import(path.join(commandsPath, file));
      const command = commandModule.command;
      const executeFn = commandModule.execute;

      if (!command || !executeFn) {
        console.warn(`⚠️ Command file ${file} missing 'command' or 'execute' export.`);
        continue;
      }

      if (!command.name || !command.data || typeof command.data.toJSON !== "function") {
        console.warn(`⚠️ Invalid SlashCommandBuilder structure in ${file}.`);
        continue;
      }

      client.commands.set(command.name, executeFn);
      commandsData.push(command.data.toJSON());
      console.log(`✅ Loaded command: ${command.name}`);
    } catch (err) {
      console.error(`❌ Failed to load command ${file}:`, err);
    }
  }

  // =============================
  // 🔹 LOAD ALL EVENTS
  // =============================
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(
      (file) =>
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".disabled")
    );

  for (const file of eventFiles) {
    try {
      const eventModule = await import(path.join(eventsPath, file));
      const event = eventModule.default;

      if (!event || !event.name || typeof event.execute !== "function") {
        console.warn(`⚠️ Event file ${file} missing required properties.`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }

      console.log(`📡 Loaded event: ${event.name}`);
    } catch (err) {
      console.error(`❌ Failed to load event ${file}:`, err);
    }
  }

  // =============================
  // 🔹 REGISTER SLASH COMMANDS
  // =============================
  client.once(Events.ClientReady, async () => {
    console.log(`🤖 Logged in as ${client.user?.tag}`);

    try {
      const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

      if (commandsData.length === 0) {
        console.warn("⚠️ No commands found to register.");
        return;
      }

      console.log(`🔄 Registering ${commandsData.length} slash commands...`);
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commandsData,
      });

      console.log(`✅ Successfully registered ${commandsData.length} commands.`);
    } catch (error) {
      console.error("❌ Failed to register slash commands:", error);
    }
  });

  // =============================
  // 🔹 MESSAGE EVENT → XP HANDLER
  // =============================
  client.on(Events.MessageCreate, async (message) => {
    try {
      await handleXP(message);
    } catch (error) {
      console.error("❌ Error handling XP:", error);
    }
  });

  // =============================
  // 🔹 INTERACTION HANDLER
  // =============================
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.warn(`⚠️ No command found for ${interaction.commandName}`);
      return;
    }

    try {
      await command(interaction);
    } catch (err) {
      console.error("❌ Command execution error:", err);

      const errorMsg = {
        content: "❌ An error occurred while running this command.",
        ephemeral: true,
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(errorMsg);
      } else {
        await interaction.reply(errorMsg);
      }
    }
  });

  // =============================
  // 🔹 LOGIN BOT
  // =============================
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error("❌ Failed to login:", error);
    process.exit(1);
  }
})();
