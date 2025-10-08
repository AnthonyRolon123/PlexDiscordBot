import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import configs from './config.js';

const isEphemeral = false;

//letting user know its online
configs.client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

configs.client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(!interaction.member.roles.cache.has(process.env.ROLE_ID) && interaction.user.id !== '394972756141146124'){
        return interaction.reply({content: 'You do not have permission to use this command.', ephemeral: true  });
    };

    switch(interaction.commandName)
    {
        case 'skip':

            await interaction.deferReply({ ephemeral: isEphemeral });

            try {
                await playback('skipNext');
            } catch (e) {}

            interaction.followUp({content: `Skipped`, ephemeral: isEphemeral  });

            break;
        
        case 'resume': 
            await interaction.deferReply({ ephemeral: isEphemeral });

            try {
                await playback('play');
            } catch (e) {}

            interaction.followUp({content: `Resuming Movie`, ephemeral: isEphemeral  });

            break;
        case 'pause': 
            await interaction.deferReply({ ephemeral: isEphemeral });

            try {
                await playback('pause');
            } catch (e) {}

            interaction.followUp({content: `Pausing Movie`, ephemeral: isEphemeral  });

            break;
    }
});

const playback = async (command) => {
    await axios({
        method: 'get',
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/${command}`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            type: 'video',
            commandID: 0,
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
        }
    })
}

configs.client.login(process.env.TOKEN);