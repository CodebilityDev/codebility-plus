import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    StringSelectMenuInteraction
} from 'discord.js';

// Command definition
export const command = {
    name: 'help',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and their usage')
};

// Command execution
export async function execute(interaction: ChatInputCommandInteraction) {
    // Check if user has specific roles
    const member = interaction.member;
    
    // Replace these with your actual role IDs or names
    const ADMIN_ROLE_ID = '1002523422263349299'; 
    const MEMBER_ROLE_ID = '1002772903642812416'; 
    
    let isAdmin = false;
    let isMember = false;
    
    if (member && typeof member.roles !== 'string' && 'cache' in member.roles) {
        // Check for admin role
        isAdmin = member.roles.cache.has(ADMIN_ROLE_ID);
        // Check for member role
        isMember = member.roles.cache.has(MEMBER_ROLE_ID);
    }
    
    // If user has neither role, show error
    if (!isAdmin && !isMember) {
        return interaction.reply({
            content: '❌ You need to have either the Member or Admin role to use this command.',
            ephemeral: true
        });
    }
    
    // Main help embed
    const mainEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('📚 Codebility Bot Help Guide\n\u200B')
        .setDescription('Welcome to the bot tutorial! Select a command category below to learn more.\n\u200B')
        .setFooter({ text: 'Use the dropdown menu to view detailed command information' })
        .setTimestamp();

    // Create select menu options based on role
    const selectOptions: Array<{
        label: string;
        description: string;
        value: string;
        emoji: string;
    }> = [];

    // If user is ADMIN - show admin commands and all commands
    if (isAdmin) {
        mainEmbed.addFields({
            name: '⚙️ Admin Commands\n\u200B',
            value: '`/levelupmessage` • `/configxp` • `/resetxp` • `/rewards` • `/rank` • `/leaderboard`\n\u200B',
            inline: false
        });
        
        // Add admin command options
        selectOptions.push(
            {
                label: 'Level Up Message',
                description: 'Configure level-up notifications',
                value: 'levelupmessage',
                emoji: '📢'
            },
            {
                label: 'Config XP',
                description: 'Configure XP system settings',
                value: 'configxp',
                emoji: '⚙️'
            },
            {
                label: 'Reset XP',
                description: 'Reset XP for users',
                value: 'resetxp',
                emoji: '🔄'
            },
            {
                label: 'Rewards',
                description: 'Manage level rewards',
                value: 'rewards',
                emoji: '🎁'
            },
            {
                label: 'Rank',
                description: 'View your current rank and XP',
                value: 'rank',
                emoji: '📊'
            },
            {
                label: 'Leaderboard',
                description: 'View server XP leaderboard',
                value: 'leaderboard',
                emoji: '🏆'
            }
        );
    } 
    // If user is MEMBER - show only member commands
    else if (isMember) {
        mainEmbed.addFields({
            name: '👥 Member Commands',
            value: '`/rank` • `/leaderboard`',
            inline: false
        });
        
        // Add only member command options
        selectOptions.push(
            {
                label: 'Rank',
                description: 'View your current rank and XP',
                value: 'rank',
                emoji: '📊'
            },
            {
                label: 'Leaderboard',
                description: 'View server XP leaderboard',
                value: 'leaderboard',
                emoji: '🏆'
            }
        );
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_select')
        .setPlaceholder('Select a command to learn more')
        .addOptions(selectOptions);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    const response = await interaction.reply({
        embeds: [mainEmbed],
        components: [row],
        ephemeral: true
    });

    // Create collector for select menu
    const collector = response.createMessageComponentCollector({
        time: 300000 // 5 minutes
    });

    collector.on('collect', async (i: StringSelectMenuInteraction) => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({ 
                content: 'This menu is not for you!', 
                ephemeral: true 
            });
        }

        const selectedCommand = i.values[0];
        
        // Handle "Go Back" option
        if (selectedCommand === 'go_back') {
            await i.update({
                embeds: [mainEmbed],
                components: [row]
            });
            return;
        }

        const commandEmbed = getCommandEmbed(selectedCommand);

        // Create a new select menu with "Go Back" option
        const backSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_select')
            .setPlaceholder('Select a command or go back')
            .addOptions([
                {
                    label: '← Go Back',
                    description: 'Return to main help menu',
                    value: 'go_back',
                    emoji: '◀️'
                },
                ...selectOptions
            ]);

        const backRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(backSelectMenu);

        await i.update({
            embeds: [commandEmbed],
            components: [backRow]
        });
    });

    collector.on('end', () => {
        // Disable the select menu after timeout
        selectMenu.setDisabled(true);
        interaction.editReply({ components: [row] }).catch(() => {});
    });
}

type CommandKey = 'rank' | 'leaderboard' | 'levelupmessage' | 'configxp' | 'resetxp' | 'rewards';

function getCommandEmbed(command: string): EmbedBuilder {
    const embeds: Record<CommandKey, EmbedBuilder> = {
        rank: new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📊 /rank Command')
            .setDescription('View your current rank, level, and XP progress in the server.\n\u200B')
            .addFields(
                { 
                    name: '📝 Usage', 
                    value: '```/rank [user]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Options', 
                    value: '**user** - Simply specify a user to view their stats\n\u200B' +
                           '                                                    \n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Examples', 
                    value: 'Use `/rank [user]` to see the specified user\'s current level, XP, and progress to the next level' +
                           '                                                                                         \n\u200B',
                    inline: false 
                }
            ),

        leaderboard: new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🏆 /leaderboard Command')
            .setDescription('View the top-ranked members in the server by XP.\n\u200B')
            .addFields(
                { 
                    name: '📝 Usage', 
                    value: '```/leaderboard [limit]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Options', 
                    value: '**limit** - Displays the numbers of users\n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Example', 
                    value: 'Use `/leaderboard [10]` to see who has the most XP in the server.\n\u200B' +
                           'Use `/leaderboard` only to see everyone on the leaderboard list.',
                    inline: false 
                }
            ),

        levelupmessage: new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('📢 /levelupmessage Command')
            .setDescription('Configure level-up notification messages and settings.\n\u200B')
            .addFields(
                { 
                    name: '🔒 Permissions', 
                    value: '**Admin Roles Only**\n\u200B' +
                           '                    \n\u200B',
                    inline: false 
                },
                { 
                    name: '📝 Usage', 
                    value: '```/levelupmessage [option]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Options', 
                    value: '**message:** Set a custom message (use `{user}` and `{level}` placeholders)\n\n' +
                           '**channel:** Set the channel for level-up messages\n\n' +
                           '**enable:** Enable or disable level-up messages\n\n' +
                           '**reset:** Reset to the default message template\n\u200B' + 
                           '                                                \n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Examples', 
                    value: '`/levelupmessage message: Congrats {user}! You reached level {level}!`\n\n' +
                           '`/levelupmessage channel: #level-ups`\n\n' +
                           '`/levelupmessage enable: true`\n\n' +
                           '`/levelupmessage reset`\n\u200B',
                    inline: false 
                }
            ),

        configxp: new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('⚙️ /configxp Command')
            .setDescription('Configure various XP system settings.\n\u200B')
            .addFields(
                { 
                    name: '🔒 Permissions', 
                    value: '**Admin Roles Only**\n\u200B' + 
                           '                    \n\u200B',
                    inline: false 
                },
                { 
                    name: '📝 Usage', 
                    value: '```/configxp [subcommand]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Subcommands', 
                    value: '**view:** View current XP configuration\n\n' +
                           '**notifications:** Configure XP gain notifications\n\n' +
                           '**rewards:** Configure level-up rewards\n\n' +
                           '**message:** Set XP gain message settings\n\n' +
                           '**settings:** Adjust XP gain rates and cooldowns\n\u200B' + 
                           '                                                \n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Examples', 
                    value: '`/configxp view`\n\n' +
                           '`/configxp notifications enabled:True, channel:#general`\n\n' +
                           '`/configxp rewards channel:#rewards, message:[custom message]`\n\n' +
                           '`/configxp settings min:10, max:20, cooldown:60, levelup_channel: #level-ups`\n\n' +
                           '`/configxp message template:[custom levelupmessage]`\n\u200B',
                    inline: false 
                }
            ),

        resetxp: new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('🔄 /resetxp Command')
            .setDescription('Reset XP for specific users or the entire server.\n\u200B')
            .addFields(
                { 
                    name: '🔒 Permissions', 
                    value: '**Admin Roles Only**\n\u200B' +
                           '                    \n\u200B',
                    inline: false 
                },
                { 
                    name: '📝 Usage', 
                    value: '```/resetxp [target]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Options', 
                    value: '**user:** (Optional) Specify a user to reset their XP. Leave empty to reset all users.\n\u200B' + 
                           '                                                                                      \n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Examples', 
                    value: '`/resetxp user: @Username` - Reset specific user\n\n' +
                           '`/resetxp` - Reset all server XP (requires confirmation)\n\u200B' +
                           '                                                        \n\u200B',
                    inline: false 
                },
                { 
                    name: '⚠️ Warning', 
                    value: 'This action cannot be undone! Use with caution.',
                    inline: false 
                }
            ),

        rewards: new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('🎁 /rewards Command')
            .setDescription('Manage role rewards for reaching specific levels.\n\u200B')
            .addFields(
                { 
                    name: '🔒 Permissions', 
                    value: '**Admin Roles Only**\n\u200B' +
                    '                           \n\u200B',
                    inline: false 
                },
                { 
                    name: '📝 Usage', 
                    value: '```/rewards [action]```\n\u200B',
                    inline: false 
                },
                { 
                    name: '📖 Options', 
                    value: '**Create Reward:** Add a new level reward role\n\n' +
                           '**Remove Reward:** Remove an existing level reward\n\n' +
                           '**List Rewards:** View all configured level rewards\n\u200B' + 
                           '                                           \n\u200B',
                    inline: false 
                },
                { 
                    name: '✨ Examples', 
                    value: '`/rewards action: Create Reward, level:10, type:Role, value:[Role ID]`\n\n' +
                           '`/rewards action: Remove Reward, level: 10, type:Role, value:[Role ID]`\n\n' +
                           '`/rewards action: List Rewards`',
                    inline: false 
                }
            )
    };

    return embeds[command as CommandKey] || new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('❓ Command Not Found')
        .setDescription('Could not find information for this command.');
}