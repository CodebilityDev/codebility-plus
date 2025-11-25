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
import { CommandModule, CommandExecuteFunction } from "./types/commands";

// =============================
// ✅ Load environment variables safely
// =============================
const envPath = process.env.ENV_PATH || path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envPath)) {
  console.warn(
    `⚠️ .env file not found at ${envPath}. Make sure to create one with required variables.`
  );
}

dotenv.config({ path: envPath });

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing in environment variables!");
  process.exit(1);
}

// =============================
// 🔹 Extend Client to include command collection
// =============================
declare module "discord.js" {
  interface Client {
    commands: Collection<string, CommandExecuteFunction>;
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

  const commandsData: ReturnType<SlashCommandBuilder['toJSON']>[] = [];

  for (const file of commandFiles) {
    try {
      const commandModule = await import(path.join(commandsPath, file));
      const command = commandModule.command;
      const executeFn = commandModule.execute;

      if (!command || !executeFn) {
        console.warn(
          `⚠️ Command file ${file} missing 'command' or 'execute' export.`
        );
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
      const rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN!
      );

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
  // 🔹 HEALTH MONITORING & ERROR HANDLING
  // =============================
  client.on("error", (error) => {
    console.error("❌ Discord client error:", error);
    // TODO: Send alert to monitoring service
    // Example: sendToMonitoringService({ type: 'client_error', error });
  });

  client.on("warn", (warning) => {
    console.warn("⚠️ Discord client warning:", warning);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (error: Error) => {
    console.error("❌ Unhandled promise rejection:", error);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    console.error("❌ Uncaught exception:", error);
    // Give time for logging before exit
    setTimeout(() => process.exit(1), 1000);
  });

  // =============================
  // 🔹 GRACEFUL SHUTDOWN
  // =============================
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

    try {
      // Close Discord client connection
      if (client.isReady()) {
        console.log("📡 Closing Discord connection...");
        await client.destroy();
        console.log("✅ Discord connection closed");
      }

      console.log("✅ Shutdown completed successfully");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  };

  // Listen for shutdown signals
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

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
