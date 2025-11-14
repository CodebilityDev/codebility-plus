"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// apps/bot/index.ts
const discord_js_1 = require("discord.js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const xpSystem_1 = require("./utils/xpSystem");
// =============================
// ✅ Load environment variables safely
// =============================
const envPath = process.env.ENV_PATH || path.resolve(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
    console.warn(`⚠️ .env file not found at ${envPath}. Make sure to create one with required variables.`);
}
dotenv.config({ path: envPath });
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN is missing in environment variables!");
    process.exit(1);
}
(async () => {
    // --- Initialize Discord client ---
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.MessageContent,
            discord_js_1.GatewayIntentBits.GuildMembers,
        ],
    });
    client.commands = new discord_js_1.Collection();
    // =============================
    // 🔹 LOAD ALL COMMANDS
    // =============================
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".disabled"));
    const commandsData = [];
    for (const file of commandFiles) {
        try {
            const commandModule = await Promise.resolve(`${path.join(commandsPath, file)}`).then(s => __importStar(require(s)));
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
        }
        catch (err) {
            console.error(`❌ Failed to load command ${file}:`, err);
        }
    }
    // =============================
    // 🔹 LOAD ALL EVENTS
    // =============================
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".disabled"));
    for (const file of eventFiles) {
        try {
            const eventModule = await Promise.resolve(`${path.join(eventsPath, file)}`).then(s => __importStar(require(s)));
            const event = eventModule.default;
            if (!event || !event.name || typeof event.execute !== "function") {
                console.warn(`⚠️ Event file ${file} missing required properties.`);
                continue;
            }
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            console.log(`📡 Loaded event: ${event.name}`);
        }
        catch (err) {
            console.error(`❌ Failed to load event ${file}:`, err);
        }
    }
    // =============================
    // 🔹 REGISTER SLASH COMMANDS
    // =============================
    client.once(discord_js_1.Events.ClientReady, async () => {
        console.log(`🤖 Logged in as ${client.user?.tag}`);
        try {
            const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
            if (commandsData.length === 0) {
                console.warn("⚠️ No commands found to register.");
                return;
            }
            console.log(`🔄 Registering ${commandsData.length} slash commands...`);
            await rest.put(discord_js_1.Routes.applicationCommands(client.user.id), {
                body: commandsData,
            });
            console.log(`✅ Successfully registered ${commandsData.length} commands.`);
        }
        catch (error) {
            console.error("❌ Failed to register slash commands:", error);
        }
    });
    // =============================
    // 🔹 MESSAGE EVENT → XP HANDLER
    // =============================
    client.on(discord_js_1.Events.MessageCreate, async (message) => {
        try {
            await (0, xpSystem_1.handleXP)(message);
        }
        catch (error) {
            console.error("❌ Error handling XP:", error);
        }
    });
    // =============================
    // 🔹 INTERACTION HANDLER
    // =============================
    client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.warn(`⚠️ No command found for ${interaction.commandName}`);
            return;
        }
        try {
            await command(interaction);
        }
        catch (err) {
            console.error("❌ Command execution error:", err);
            const errorMsg = {
                content: "❌ An error occurred while running this command.",
                ephemeral: true,
            };
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp(errorMsg);
            }
            else {
                await interaction.reply(errorMsg);
            }
        }
    });
    // =============================
    // 🔹 LOGIN BOT
    // =============================
    try {
        await client.login(process.env.DISCORD_TOKEN);
    }
    catch (error) {
        console.error("❌ Failed to login:", error);
        process.exit(1);
    }
})();
