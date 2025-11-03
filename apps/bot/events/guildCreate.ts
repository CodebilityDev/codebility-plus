// apps/bot/events/guildCreate.ts
import { Events, Guild } from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";

export default {
  name: Events.GuildCreate,
  /**
   * Triggered when the bot joins a new Discord guild (server)
   * @param {Guild} guild - The guild the bot joined
   */
  async execute(guild: Guild) {
    try {
      console.log(`🤝 Joined new guild: ${guild.name} (${guild.id})`);

      const iconUrl = guild.iconURL({ size: 512 }) ?? null;

      // Step 1: Upsert guild record (simpler than check-then-insert)
      const { data: upsertedGuild, error: guildError } = await supabaseBot
        .from("guilds_discord")
        .upsert(
          {
            id: guild.id, // String, not BigInt
            name: guild.name,
            icon_url: iconUrl,
            owner_id: guild.ownerId || null, // String, not BigInt
            active: true,
            left_at: null, // Clear left_at in case bot rejoined
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (guildError) {
        console.error("❌ Error upserting guild record:", guildError.message);
        return;
      }

      console.log(`✅ Guild registered: ${upsertedGuild.name} (${upsertedGuild.id})`);

      // Step 2: Initialize XP config for this guild (if doesn't exist)
      const { data: existingConfig } = await supabaseBot
        .from("xp_config_discord")
        .select("id")
        .eq("guild_id", guild.id)
        .maybeSingle();

      if (!existingConfig) {
        const { error: xpError } = await supabaseBot
          .from("xp_config_discord")
          .insert({
            guild_id: guild.id, // String, not BigInt
            min_xp: 5,
            max_xp: 15,
            cooldown: 60, // seconds
            levelup_channel: null,
            levelup_message: "🎉 {user} leveled up to Level {level}!",
            active: true,
          });

        if (xpError) {
          console.error("⚠️ Failed to create XP config:", xpError.message);
        } else {
          console.log(`⚙️ Default XP config initialized for guild: ${guild.name}`);
        }
      } else {
        console.log(`ℹ️ XP config already exists for guild: ${guild.name}`);
      }

      // Step 3: Initialize default level-up message (if doesn't exist)
      const { data: existingMessage } = await supabaseBot
        .from("levelup_messages_discord")
        .select("id")
        .eq("guild_id", guild.id)
        .maybeSingle();

      if (!existingMessage) {
        const { error: messageError } = await supabaseBot
          .from("levelup_messages_discord")
          .insert({
            guild_id: guild.id, // String, not BigInt
            message_template: "🎉 {user} leveled up to Level {level}!",
            channel_id: null,
            is_enabled: true,
          });

        if (messageError) {
          console.error("⚠️ Failed to create level-up message:", messageError.message);
        } else {
          console.log(`💬 Default level-up message initialized for guild: ${guild.name}`);
        }
      }

      console.log(`🎉 Guild setup complete for: ${guild.name}`);
    } catch (error) {
      console.error("🔥 guildCreate event error:", error);
    }
  },
};