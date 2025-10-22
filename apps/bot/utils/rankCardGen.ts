// app/bot/utils/rankCardGen.ts
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
import { supabaseBot } from "./supabase.bot";

const WIDTH = 900;
const HEIGHT = 280;
const AVATAR_SIZE = 180;
const PADDING = 24;
const BAR_WIDTH = WIDTH - AVATAR_SIZE - PADDING * 3;
const BAR_HEIGHT = 28;

/**
 * Fetches an image as a buffer for loadImage().
 */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Gets user XP, level, and rank data from Supabase for a specific guild.
 * Uses the table: user_stats_discord
 */
async function getUserData(userId: string, guildId: string) {
  if (!userId || !guildId) return { xp: 0, level: 0, rank: 0, totalUsers: 0 };

  // Get user's stats
  const { data, error } = await supabaseBot
    .from("user_stats_discord")
    .select("xp, level")
    .eq("user_id", userId) // String, not BigInt
    .eq("guild_id", guildId) // String, not BigInt
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("❌ rankCardGen: Supabase error:", error.message);
    return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
  }

  if (!data) {
    return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
  }

  // Calculate rank
  const { data: allUsers, error: rankError } = await supabaseBot
    .from("user_stats_discord")
    .select("user_id, level, xp")
    .eq("guild_id", guildId)
    .eq("active", true)
    .order("level", { ascending: false })
    .order("xp", { ascending: false });

  if (rankError) {
    console.error("❌ rankCardGen: Error calculating rank:", rankError.message);
    return { xp: data.xp ?? 0, level: data.level ?? 0, rank: 0, totalUsers: 0 };
  }

  const rank = (allUsers?.findIndex((u) => u.user_id === userId) ?? -1) + 1;
  const totalUsers = allUsers?.length ?? 0;

  return {
    xp: data.xp ?? 0,
    level: data.level ?? 0,
    rank,
    totalUsers,
  };
}

/**
 * Generates a rank card image buffer for the provided Discord user.
 */
export async function generateRankCard(
  user: any,
  guildId: string
): Promise<Buffer | null> {
  try {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

    if (!ctx) throw new Error("Canvas context could not be created.");

    // === Background Layer ===
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // === Outer Card ===
    ctx.fillStyle = "#0b1220";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    roundRect(
      ctx,
      PADDING / 2,
      PADDING / 2,
      WIDTH - PADDING,
      HEIGHT - PADDING,
      16,
      true,
      false
    );
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // === Fetch XP + Level + Rank Data ===
    const { xp, level, rank, totalUsers } = await getUserData(user.id, guildId);

    // If user has no data, stop
    if (xp === 0 && level === 0) {
      console.warn("rankCardGen: User has no XP data");
      return null;
    }

    // === Username ===
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Sans";
    ctx.fillText(user.username ?? "Unknown", PADDING + AVATAR_SIZE + 20, PADDING + 45);

    // === Rank Display ===
    if (rank > 0) {
      ctx.font = "bold 20px Sans";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(
        `#${rank} of ${totalUsers}`,
        PADDING + AVATAR_SIZE + 20,
        PADDING + 75
      );
    }

    // === Level Display ===
    ctx.font = "bold 24px Sans";
    ctx.fillStyle = "#10b981";
    ctx.fillText(`Level ${level}`, PADDING + AVATAR_SIZE + 20, PADDING + 110);

    // === XP Progress ===
    const xpNext = 100 * (level + 1); // 100 XP per level
    const xpCurrent = xp % xpNext; // XP in current level
    
    ctx.font = "18px Sans";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      `${xpCurrent.toLocaleString()} / ${xpNext.toLocaleString()} XP`,
      PADDING + AVATAR_SIZE + 20,
      PADDING + 140
    );

    // === Progress Bar ===
    const barX = PADDING + AVATAR_SIZE + 20;
    const barY = PADDING + 160;

    // Background bar
    ctx.fillStyle = "#1e293b";
    roundRect(ctx, barX, barY, BAR_WIDTH - 100, BAR_HEIGHT, 14, true, false);

    // Filled progress
    const progress = Math.max(0, Math.min(1, xpCurrent / xpNext));
    const fillWidth = Math.floor((BAR_WIDTH - 100) * progress);
    
    // Gradient for progress bar
    const barGradient = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
    barGradient.addColorStop(0, "#10b981");
    barGradient.addColorStop(1, "#059669");
    ctx.fillStyle = barGradient;
    roundRect(ctx, barX, barY, fillWidth, BAR_HEIGHT, 14, true, false);

    // Progress percentage
    ctx.font = "bold 16px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      `${Math.round(progress * 100)}%`,
      barX + (BAR_WIDTH - 100) + 15,
      barY + 20
    );

    // === Total XP Badge ===
    const badgeX = WIDTH - PADDING - 90;
    const badgeY = PADDING + 20;
    ctx.fillStyle = "#1e293b";
    roundRect(ctx, badgeX, badgeY, 80, 60, 12, true, false);
    
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px Sans";
    ctx.fillText("TOTAL XP", badgeX + 10, badgeY + 20);
    
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 18px Sans";
    ctx.fillText(xp.toLocaleString(), badgeX + 10, badgeY + 45);

    // === Avatar Rendering ===
    try {
      const avatarUrl =
        typeof user.displayAvatarURL === "function"
          ? user.displayAvatarURL({ extension: "png", size: 256 })
          : user.avatarURL?.({ format: "png", size: 256 });

      if (avatarUrl) {
        const buffer = await fetchImageBuffer(avatarUrl);
        const img = await loadImage(buffer);
        const cx = PADDING + AVATAR_SIZE / 2;
        const cy = HEIGHT / 2;
        const r = AVATAR_SIZE / 2;

        // Avatar border
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
        ctx.stroke();

        // Draw avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, PADDING, cy - r, AVATAR_SIZE, AVATAR_SIZE);
        ctx.restore();
      }
    } catch (err) {
      console.warn("⚠️ rankCardGen: Failed to load avatar", err);
    }

    // === Footer ===
    ctx.font = "14px Sans";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Keep chatting to level up!`, PADDING + AVATAR_SIZE + 20, HEIGHT - PADDING - 15);

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("❌ Error generating rank card:", error);
    return null;
  }
}

/**
 * Draws a rounded rectangle.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill = true,
  stroke = false
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}