// apps/bot/utils/rankCardGen.ts
import { createCanvas, loadImage, registerFont, Canvas } from "canvas";
import { supabaseBot } from "./supabase.bot";
import { User } from "discord.js";
import { getLevelProgress } from "./xpHelper"; 
import * as https from "https";
import * as path from "path";

type CanvasContext = ReturnType<Canvas['getContext']>;

const WIDTH = 900;
const HEIGHT = 280;
const AVATAR_SIZE = 180;
const PADDING = 24;
const BAR_WIDTH = WIDTH - AVATAR_SIZE - PADDING * 3;
const BAR_HEIGHT = 28;

/** Fetch image buffer using native https */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Image fetch timeout')), 10000);
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        clearTimeout(timeout);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      
      const data: Uint8Array[] = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        clearTimeout(timeout);
        resolve(Buffer.concat(data));
      });
      res.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    }).on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/** Get user's XP, level, and rank from Supabase */
async function getUserData(userId: string, guildId: string) {
  console.log(`📊 Fetching data for user ${userId} in guild ${guildId}`);

  if (!userId || !guildId) {
    console.error("❌ rankCardGen: Missing userId or guildId");
    return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
  }

  // Fetch user stats
  const { data: userData, error } = await supabaseBot
    .from("user_stats_discord")
    .select("xp, level")
    .eq("user_id", userId)
    .eq("guild_id", guildId)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("❌ rankCardGen: Supabase fetch error:", error.message);
    return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
  }

  if (!userData) {
    console.warn(`⚠️ No user data found for ${userId}`);
    return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
  }

  console.log(`✅ User data: Level ${userData.level}, XP ${userData.xp}`);

  // Fetch all users for ranking
  const { data: allUsers, error: rankError } = await supabaseBot
    .from("user_stats_discord")
    .select("user_id, level, xp")
    .eq("guild_id", guildId)
    .eq("active", true)
    .order("level", { ascending: false })
    .order("xp", { ascending: false });

  if (rankError) {
    console.error("❌ rankCardGen: Rank query error:", rankError.message);
    return { 
      xp: userData.xp ?? 0, 
      level: userData.level ?? 0, 
      rank: 0, 
      totalUsers: 0 
    };
  }

  const rank = (allUsers?.findIndex((u) => u.user_id === userId) ?? -1) + 1;
  const totalUsers = allUsers?.length ?? 0;

  console.log(`✅ Rank: #${rank} of ${totalUsers}`);

  return {
    xp: userData.xp ?? 0,
    level: userData.level ?? 0,
    rank,
    totalUsers,
  };
}

function roundRect(
  ctx: CanvasContext,  
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill = true,
  stroke = false
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
  
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/** Generate the rank card image for a Discord user */
export async function generateRankCard(
  user: User,
  guildId: string
): Promise<Buffer | null> {
  console.log(`🎨 Starting rank card generation for ${user.username} (${user.id})`);

  try {
    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context could not be created.");
    }

    // Enable text antialiasing
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    // === BACKGROUND GRADIENT ===
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // === OUTER CARD WITH SHADOW ===
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = "#0b1220";
    roundRect(ctx, PADDING / 2, PADDING / 2, WIDTH - PADDING, HEIGHT - PADDING, 18, true);
    
    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // === FETCH USER DATA ===
    const { xp, level, rank, totalUsers } = await getUserData(user.id, guildId);

    if (xp === 0 && level === 0) {
      console.warn(`⚠️ rankCardGen: No XP data for user ${user.id}`);
      return null;
    }

    const progressInfo = getLevelProgress(xp);
    const displayLevel = level ?? progressInfo.level;
    const xpIntoLevel = progressInfo.xpIntoLevel;
    const xpNext = progressInfo.xpToNextLevel;
    const progressRatio = Math.min(1, xpIntoLevel / xpNext);

    console.log(`📈 Progress: ${xpIntoLevel}/${xpNext} (${Math.round(progressRatio * 100)}%)`);

    // === USERNAME ===
    const textX = PADDING + AVATAR_SIZE + 24;
    let textY = PADDING + 30;

    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#ffffff";
    const username = user.username || "Unknown User";
    ctx.fillText(username, textX, textY);
    console.log(`✏️ Drew username: ${username}`);

    // === RANK ===
    if (rank > 0) {
      textY += 38;
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "#fbbf24";
      const rankText = `#${rank} of ${totalUsers}`;
      ctx.fillText(rankText, textX, textY);
      console.log(`✏️ Drew rank: ${rankText}`);
    }

    // === LEVEL ===
    textY += (rank > 0 ? 32 : 38);
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#10b981";
    const levelText = `Level ${displayLevel}`;
    ctx.fillText(levelText, textX, textY);
    console.log(`✏️ Drew level: ${levelText}`);

    // === XP TEXT ===
    textY += 32;
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    const xpText = `${xpIntoLevel.toLocaleString()} / ${xpNext.toLocaleString()} XP`;
    ctx.fillText(xpText, textX, textY);
    console.log(`✏️ Drew XP: ${xpText}`);

    // === XP PROGRESS BAR ===
    const barX = textX;
    const barY = textY + 28;
    const actualBarWidth = BAR_WIDTH - 100;
    const progressWidth = Math.floor(actualBarWidth * progressRatio);

    // Bar background
    ctx.fillStyle = "#1e293b";
    roundRect(ctx, barX, barY, actualBarWidth, BAR_HEIGHT, 14, true);

    // Bar progress with gradient
    if (progressWidth > 0) {
      const barGradient = ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
      barGradient.addColorStop(0, "#10b981");
      barGradient.addColorStop(1, "#059669");
      ctx.fillStyle = barGradient;
      roundRect(ctx, barX, barY, progressWidth, BAR_HEIGHT, 14, true);
    }

    // Progress percentage
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    const percentText = `${Math.round(progressRatio * 100)}%`;
    ctx.fillText(percentText, barX + actualBarWidth + 12, barY + 6);
    console.log(`✏️ Drew progress: ${percentText}`);

    // === TOTAL XP BADGE ===
    const badgeX = WIDTH - PADDING - 95;
    const badgeY = PADDING + 20;
    const badgeWidth = 90;
    const badgeHeight = 65;

    ctx.fillStyle = "#1e293b";
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 12, true);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL XP", badgeX + 8, badgeY + 12);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 16px sans-serif";
    const totalXpText = xp.toLocaleString();
    ctx.fillText(totalXpText, badgeX + 8, badgeY + 32);
    console.log(`✏️ Drew total XP: ${totalXpText}`);

    // === AVATAR ===
    try {
      // Use correct Discord.js v14 method
      const avatarUrl = user.displayAvatarURL({ 
        extension: "png", 
        size: 256 
      });

      console.log(`🖼️ Loading avatar from: ${avatarUrl}`);

      const buffer = await fetchImageBuffer(avatarUrl);
      const img = await loadImage(buffer);

      const cx = PADDING + AVATAR_SIZE / 2;
      const cy = HEIGHT / 2;
      const r = AVATAR_SIZE / 2;

      // Draw avatar border (ring)
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.stroke();

      // Clip and draw avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, PADDING, cy - r, AVATAR_SIZE, AVATAR_SIZE);
      ctx.restore();

      console.log(`✅ Avatar drawn successfully`);
    } catch (err) {
      console.error("❌ Failed to load avatar:", err);
      
      // Draw fallback circle with initial
      const cx = PADDING + AVATAR_SIZE / 2;
      const cy = HEIGHT / 2;
      const r = AVATAR_SIZE / 2;
      
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(username[0]?.toUpperCase() || "?", cx, cy);
      
      // Reset text properties
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
    }

    // === FOOTER TEXT ===
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "left";
    ctx.fillText("Keep chatting to level up!", textX, HEIGHT - PADDING - 20);

    console.log(`✅ Rank card generation complete`);

    // Return PNG buffer
    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("❌ rankCardGen: Error generating rank card:", error);
    return null;
  }
}