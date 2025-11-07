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
exports.generateRankCard = generateRankCard;
// apps/bot/utils/rankCardGen.ts
const canvas_1 = require("canvas");
const supabase_bot_1 = require("./supabase.bot");
const https = __importStar(require("https"));
const WIDTH = 900;
const HEIGHT = 280;
const AVATAR_SIZE = 180;
const PADDING = 24;
const BAR_WIDTH = WIDTH - AVATAR_SIZE - PADDING * 3;
const BAR_HEIGHT = 28;
// XP Formula Constants
const BASE_XP = 100;
/** XP required for a specific level */
function xpForLevel(level) {
    return BASE_XP * (level + 1);
}
/** Compute total cumulative XP to reach the start of the given level */
function cumulativeXpToReachLevel(level) {
    let total = 0;
    for (let i = 0; i < level; i++)
        total += xpForLevel(i);
    return total;
}
/** Compute level progress info from total XP */
function getLevelProgress(totalXp) {
    let level = 0;
    let remaining = totalXp;
    while (remaining >= xpForLevel(level)) {
        remaining -= xpForLevel(level);
        level++;
    }
    return {
        level,
        xpIntoLevel: remaining,
        xpToNextLevel: xpForLevel(level),
    };
}
/** Fetch image buffer using native https to support Node.js */
async function fetchImageBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const data = [];
            res.on("data", (chunk) => data.push(chunk));
            res.on("end", () => resolve(Buffer.concat(data)));
            res.on("error", reject);
        }).on("error", reject);
    });
}
/** Get user's XP, level, and rank from Supabase */
async function getUserData(userId, guildId) {
    if (!userId || !guildId) {
        console.error("❌ rankCardGen: Missing userId or guildId");
        return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
    }
    // Fetch user stats
    const { data: userData, error } = await supabase_bot_1.supabaseBot
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
    if (!userData)
        return { xp: 0, level: 0, rank: 0, totalUsers: 0 };
    // Fetch all users for ranking
    const { data: allUsers, error: rankError } = await supabase_bot_1.supabaseBot
        .from("user_stats_discord")
        .select("user_id, level, xp")
        .eq("guild_id", guildId)
        .eq("active", true)
        .order("level", { ascending: false })
        .order("xp", { ascending: false });
    if (rankError) {
        console.error("❌ rankCardGen: Rank query error:", rankError.message);
        return { xp: userData.xp ?? 0, level: userData.level ?? 0, rank: 0, totalUsers: 0 };
    }
    const rank = (allUsers?.findIndex((u) => u.user_id === userId) ?? -1) + 1;
    const totalUsers = allUsers?.length ?? 0;
    return {
        xp: userData.xp ?? 0,
        level: userData.level ?? 0,
        rank,
        totalUsers,
    };
}
/** Draw a rounded rectangle */
function roundRect(ctx, x, y, w, h, r, fill = true, stroke = false) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    if (fill)
        ctx.fill();
    if (stroke)
        ctx.stroke();
}
/** Generate the rank card image for a Discord user */
async function generateRankCard(user, guildId) {
    try {
        const canvas = (0, canvas_1.createCanvas)(WIDTH, HEIGHT);
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Canvas context could not be created.");
        // === BACKGROUND ===
        const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        gradient.addColorStop(0, "#0f172a");
        gradient.addColorStop(1, "#1e293b");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        // === OUTER CARD ===
        ctx.fillStyle = "#0b1220";
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;
        roundRect(ctx, PADDING / 2, PADDING / 2, WIDTH - PADDING, HEIGHT - PADDING, 18, true);
        ctx.shadowColor = "transparent";
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
        // === TEXTS ===
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(user.username ?? "Unknown User", PADDING + AVATAR_SIZE + 20, PADDING + 45);
        if (rank > 0) {
            ctx.font = "bold 20px Arial";
            ctx.fillStyle = "#fbbf24";
            ctx.fillText(`#${rank} of ${totalUsers}`, PADDING + AVATAR_SIZE + 20, PADDING + 75);
        }
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#10b981";
        ctx.fillText(`Level ${displayLevel}`, PADDING + AVATAR_SIZE + 20, PADDING + 110);
        ctx.font = "18px Arial";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(`${xpIntoLevel.toLocaleString()} / ${xpNext.toLocaleString()} XP`, PADDING + AVATAR_SIZE + 20, PADDING + 140);
        // === XP BAR ===
        const barX = PADDING + AVATAR_SIZE + 20;
        const barY = PADDING + 160;
        const progressWidth = Math.floor((BAR_WIDTH - 100) * progressRatio);
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, barX, barY, BAR_WIDTH - 100, BAR_HEIGHT, 14, true);
        const barGradient = ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
        barGradient.addColorStop(0, "#10b981");
        barGradient.addColorStop(1, "#059669");
        ctx.fillStyle = barGradient;
        roundRect(ctx, barX, barY, progressWidth, BAR_HEIGHT, 14, true);
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${Math.round(progressRatio * 100)}%`, barX + (BAR_WIDTH - 100) + 15, barY + 20);
        // === TOTAL XP BOX ===
        const badgeX = WIDTH - PADDING - 90;
        const badgeY = PADDING + 20;
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, badgeX, badgeY, 80, 60, 12, true);
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 12px Arial";
        ctx.fillText("TOTAL XP", badgeX + 10, badgeY + 20);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 18px Arial";
        ctx.fillText(xp.toLocaleString(), badgeX + 10, badgeY + 45);
        // === AVATAR ===
        try {
            const avatarUrl = typeof user.displayAvatarURL === "function"
                ? user.displayAvatarURL({ extension: "png", size: 256 })
                : user.avatarURL?.({ format: "png", size: 256 });
            if (avatarUrl) {
                const buffer = await fetchImageBuffer(avatarUrl);
                const img = await (0, canvas_1.loadImage)(buffer);
                const cx = PADDING + AVATAR_SIZE / 2;
                const cy = HEIGHT / 2;
                const r = AVATAR_SIZE / 2;
                ctx.strokeStyle = "#10b981";
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, PADDING, cy - r, AVATAR_SIZE, AVATAR_SIZE);
                ctx.restore();
            }
        }
        catch (err) {
            console.warn("⚠️ rankCardGen: Failed to load avatar", err);
        }
        // === FOOTER ===
        ctx.font = "14px Arial";
        ctx.fillStyle = "#64748b";
        ctx.fillText("Keep chatting to level up!", PADDING + AVATAR_SIZE + 20, HEIGHT - PADDING - 15);
        return canvas.toBuffer("image/png");
    }
    catch (error) {
        console.error("❌ rankCardGen: Error generating rank card:", error);
        return null;
    }
}
