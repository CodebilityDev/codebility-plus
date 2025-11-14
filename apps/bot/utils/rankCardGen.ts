// apps/bot/utils/rankCardGen.ts

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { User } from "discord.js";
import { supabaseBot } from "./supabase.bot";
import { getLevelProgress } from "./xpHelper";

interface RewardRole {
  id: string;
  name: string;
  color: string;
  levelRequirement: number;
}

interface UserStatsDiscord {
  user_id: string;
  xp: number;
  level: number;
}

export async function generateRankCard(
  user: User,
  guildId: string,
  rewardRoles: RewardRole[] = []
): Promise<Buffer | null> {
  try {
    // Fetch user stats
    const { data: userData, error } = await supabaseBot
      .from("user_stats_discord")
      .select("xp, level")
      .eq("guild_id", guildId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !userData) {
      console.error("❌ Error fetching user data for rank card:", error);
      return null;
    }

    // Use the SAME progress calculation as rankCard.ts
    const progress = getLevelProgress(userData.xp);

    // Fetch rank
    const { data: allUsers } = await supabaseBot
      .from("user_stats_discord")
      .select("user_id, xp, level")
      .eq("guild_id", guildId)
      .eq("active", true)
      .order("level", { ascending: false })
      .order("xp", { ascending: false });

    let rank = 0;
    let totalUsers = 0;
    
    if (allUsers && allUsers.length > 0) {
      totalUsers = allUsers.length;
      const position = (allUsers as UserStatsDiscord[]).findIndex((u) => u.user_id === user.id);
      rank = position !== -1 ? position + 1 : 0;
    }

    // Canvas setup - more spacious
    const width = 620;
    const height = 220;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background - dark navy
    ctx.fillStyle = "#1a1f2e";
    ctx.fillRect(0, 0, width, height);

    // Outer border with rounded corners - cyan/teal
    ctx.strokeStyle = "#2dd4bf";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(10, 10, width - 20, height - 20, 15);
    ctx.stroke();

    // === Avatar ===
    const avatarX = 80;
    const avatarY = height / 2;
    const avatarRadius = 60;

    // Avatar with circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(
      user.displayAvatarURL({ extension: "png", size: 256 })
    );
    ctx.drawImage(
      avatar,
      avatarX - avatarRadius,
      avatarY - avatarRadius,
      avatarRadius * 2,
      avatarRadius * 2
    );
    ctx.restore();

    // Avatar border - cyan/teal
    ctx.strokeStyle = "#2dd4bf";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.stroke();

    // === Username ===
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Arial";
    ctx.fillText(user.username, 165, 50);

    // === Rank Badge (yellow/gold) ===
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 17px Arial";
    const rankText = rank > 0 ? `#${rank} of ${totalUsers}` : "Unranked";
    ctx.fillText(rankText, 165, 78);

    // === Level (cyan/teal) ===
    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 19px Arial";
    ctx.fillText(`Level ${progress.level}`, 165, 105);

    // === XP Progress Text ===
    const progressText = `${progress.xpIntoLevel} / ${progress.xpToNextLevel} XP`;
    ctx.fillStyle = "#9ca3af";
    ctx.font = "15px Arial";
    ctx.fillText(progressText, 165, 128);

    // === Progress Bar ===
    const barX = 165;
    const barY = 140;
    const barWidth = 400;
    const barHeight = 22;
    // Calculate percentage and cap at 100% to prevent overflow
    const progressPercent = Math.min(progress.xpIntoLevel / progress.xpToNextLevel, 1);

    // Bar background - dark gray
    ctx.fillStyle = "#374151";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 11);
    ctx.fill();

    // Bar fill - cyan/teal
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * progressPercent, barHeight, 11);
    ctx.fill();

    // Progress percentage
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(progressPercent * 100)}%`, width - 25, barY + 16);
    ctx.textAlign = "left";

    // === Total XP Badge (Top Right - orange/yellow) ===
    ctx.fillStyle = "#fb923c";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText("TOTAL XP", width - 25, 32);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px Arial";
    ctx.fillText(userData.xp.toString(), width - 25, 58);
    ctx.textAlign = "left";

    // === Bottom tagline ===
    ctx.fillStyle = "#6b7280";
    ctx.font = "13px Arial";
    ctx.fillText("Keep chatting to level up!", 165, 178);

    // === Reward Roles Section ===
    if (rewardRoles.length > 0) {
      // "Reward Roles:" label
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px Arial";
      ctx.fillText("Reward Roles:", 165, 198);
      
      // Display role badges
      let roleX = 265;
      const roleY = 198;
      const maxWidth = width - 30;
      
      for (let i = 0; i < Math.min(rewardRoles.length, 4); i++) {
        const role = rewardRoles[i];
        
        // Measure text
        ctx.font = "13px Arial";
        const roleText = ctx.measureText(role.name);
        const rolePadding = 10;
        const roleWidth = roleText.width + rolePadding * 2;
        
        // Check if we have space
        if (roleX + roleWidth > maxWidth) {
          if (i < rewardRoles.length) {
            ctx.fillStyle = "#9ca3af";
            ctx.fillText(`+${rewardRoles.length - i}`, roleX, roleY);
          }
          break;
        }
        
        // Role badge background with rounded corners
        const roleColor = role.color !== "#000000" ? role.color : "#6b7280";
        ctx.fillStyle = roleColor;
        ctx.beginPath();
        ctx.roundRect(roleX, roleY - 15, roleWidth, 20, 10);
        ctx.fill();
        
        // Role text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(role.name, roleX + rolePadding, roleY);
        
        roleX += roleWidth + 8;
      }
    }

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("❌ Error generating rank card:", error);
    return null;
  }
}