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
exports.supabaseBot = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// ✅ Load .env from the bot folder (same directory as index.ts)
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.DB_SERVICE_ROLE;
// Validate environment variables
if (!supabaseUrl || !supabaseUrl.startsWith("https")) {
    console.error("❌ Invalid or missing NEXT_PUBLIC_SUPABASE_URL in .env file");
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL in environment variables");
}
if (!supabaseServiceRole) {
    console.error("❌ Missing DB_SERVICE_ROLE in .env file");
    throw new Error("DB_SERVICE_ROLE is required in environment variables");
}
// ✅ Create and export Supabase client
exports.supabaseBot = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRole, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
console.log("✅ Supabase bot client initialized successfully");
