import { Events, GuildMember, Client } from 'discord.js';
import { supabaseBot } from '../utils/supabase.bot';

// Type definitions
interface CodevData {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number?: string;
  address?: string;
  about?: string;
  positions?: string[];
  display_position?: string;
  portfolio_website?: string;
  tech_stacks?: string[];
  image_url?: string;
  availability_status?: boolean;
  nda_status?: boolean;
  level?: any;
  application_status?: string;
  rejected_count?: number;
  facebook?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  created_at?: string;
  updated_at?: string;
  years_of_experience?: number;
  role_id?: number;
  internal_status?: string;
  mentor_id?: string;
  nda_signature?: string;
  nda_document?: string;
  nda_signed_at?: string;
  nda_request_sent?: boolean;
  date_applied?: string;
  promote_declined?: boolean;
  date_passed?: string;
  date_joined?: string;
}

// Role IDs
const ROLES = {
  CODEV: '1234478807268720650',
  ADMIN: '1002523422263349299',
};

// ---------------------------
// Helper Functions
// ---------------------------

/**
 * Ensures Discord user exists in users_discord table
 */
async function ensureUserExists(
  userId: string,
  username: string,
  displayName: string,
  avatarUrl?: string,
  discriminator?: string
): Promise<boolean> {
  try {
    const { error } = await supabaseBot
      .from('users_discord')
      .upsert(
        {
          id: userId,
          username: username || 'Unknown User',
          display_name: displayName || username || 'Unknown User',
          avatar_url: avatarUrl || null,
          discriminator: discriminator || '0',
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('❌ Error ensuring user exists:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Exception in ensureUserExists:', err);
    return false;
  }
}

/**
 * Fetches codev data from Supabase by Discord user ID
 */
async function getCodevByDiscordId(discordId: string): Promise<CodevData | null> {
  // First, get the Discord user info
  const { data: discordUser, error: discordError } = await supabaseBot
    .from('users_discord')
    .select('username, display_name')
    .eq('id', discordId)
    .single();

  if (discordError || !discordUser) {
    console.error('❌ Error fetching discord user:', discordError);
    return null;
  }

  // Then, find matching codev by comparing names
  // Try to match by display_name first, then fallback to username
  const searchName = discordUser.display_name || discordUser.username;
  
  const { data: codevData, error: codevError } = await supabaseBot
    .from('codev')
    .select('*')
    .or(`first_name.ilike.%${searchName}%,last_name.ilike.%${searchName}%`)
    .single();

  if (codevError) {
    console.error('❌ Error fetching codev data:', codevError);
    return null;
  }

  return codevData as CodevData;
}

/**
 * Alternative: Fetch codev by exact Discord ID stored in codev.discord column
 * Use this if you plan to store Discord ID in the codev table
 */
async function getCodevByDiscordIdDirect(discordId: string): Promise<CodevData | null> {
  const { data, error } = await supabaseBot
    .from('codev')
    .select('*')
    .eq('discord', discordId)
    .single();

  if (error) {
    console.error('❌ Error fetching codev data:', error);
    return null;
  }

  return data as CodevData;
}

/**
 * Determines which roles should be assigned based on codev data
 */
function determineRoles(codevData: CodevData) {
  const rolesToAssign: string[] = [];
  const rolesToRemove: string[] = [];

  // Check if admin
  if (codevData.display_position === 'Admin') {
    rolesToAssign.push(ROLES.ADMIN);
    // Admins also get codev role
    rolesToAssign.push(ROLES.CODEV);
    return { rolesToAssign, rolesToRemove };
  }

  // Check if passed applicant with available status
  if (codevData.application_status === 'passed' && codevData.availability_status === true) {
    rolesToAssign.push(ROLES.CODEV);
  }

  // Check if passed applicant with inactive status
  if (codevData.application_status === 'passed' && codevData.availability_status === false) {
    rolesToRemove.push(ROLES.CODEV);
  }

  return { rolesToAssign, rolesToRemove };
}

/**
 * Assigns roles to a member
 */
async function assignRoles(member: GuildMember, codevData: CodevData): Promise<boolean> {
  try {
    const { rolesToAssign, rolesToRemove } = determineRoles(codevData);

    // Remove roles
    for (const roleId of rolesToRemove) {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        console.log(`✅ Removed role ${roleId} from ${member.user.tag}`);
      }
    }

    // Assign roles
    for (const roleId of rolesToAssign) {
      if (!member.roles.cache.has(roleId)) {
        await member.roles.add(roleId);
        console.log(`✅ Assigned role ${roleId} to ${member.user.tag}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error assigning roles:', error);
    return false;
  }
}

/**
 * Optional: Function to check and update roles for existing members
 * This can be called manually or scheduled to run periodically
 */
export async function syncAllMemberRoles(client: Client) {
  try {
    console.log('🔄 Starting role sync for all members...');
    
    const guild = client.guilds.cache.first();
    if (!guild) {
      console.error('❌ No guild found');
      return;
    }

    const members = await guild.members.fetch();
    
    for (const [, member] of members) {
      if (member.user.bot) continue; // Skip bots

      const codevData = await getCodevByDiscordId(member.id);

      if (codevData) {
        await assignRoles(member, codevData);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Role sync completed');
  } catch (error) {
    console.error('❌ Error syncing member roles:', error);
  }
}

// ---------------------------
// Event Handler Export
// ---------------------------

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    try {
      console.log(`👋 New member joined: ${member.user.tag} (ID: ${member.id})`);

      // Ensure user exists in database
      const userExists = await ensureUserExists(
        member.id,
        member.user.username,
        member.displayName,
        member.user.displayAvatarURL(),
        member.user.discriminator || '0'
      );

      if (!userExists) {
        console.error('❌ Failed to ensure user exists');
        return;
      }

      // Fetch codev data using Discord ID
      const codevData = await getCodevByDiscordId(member.id);

      if (!codevData) {
        console.log(`ℹ️ No codev data found for ${member.user.tag}`);
        return;
      }

      // Assign appropriate roles
      await assignRoles(member, codevData);

      console.log(`✅ Successfully processed roles for ${member.user.tag}`);
    } catch (error) {
      console.error('❌ Error in guildMemberAdd event:', error);
    }
  },
};

// Export helper functions for use in other files
export {
  assignRoles,
  determineRoles,
  getCodevByDiscordId,
  getCodevByDiscordIdDirect,
};