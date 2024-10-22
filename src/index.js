import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import configs from './config.js';

//letting user know its online
configs.client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

configs.client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    switch(interaction.commandName)
    {
        case 'skip':
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            interaction.reply('Movie was skipped');
            await skipMovie();
            break;
        case 'previous':
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            interaction.reply('Playing previous movie');
            await seekToBeginning()
            await previousMovie();
            break;
        case 'restart': 
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            interaction.reply('Restarting movie');
            await seekToBeginning();
            break;
        case 'nothing':
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            break;
        case 'resume': 
            try {
                if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                };
                interaction.reply('Resuming movie');
                await resumeMovie();
                break;
            } catch (e) { console.log(e) }
        case 'pause': 
        if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            interaction.reply('Pausing movie');
            await pauseMovie();
            break;
        case 'play':
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            };
            interaction.reply('what movie do you wanna watch');

            const filter = (response) => {
                return response.author.id === interaction.user.id
            }

            const collector = interaction.channel.createMessageCollector({ filter, time: 15000});

            collector.on('collect', async (query) => {
                interaction.followUp('Playing movie')
                await skipTo(query);
            })

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.followUp('You did not respond in time!');
                }
            });

            break;  
    }
});

const skipMovie = async () => {
    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/skipNext`,
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

const previousMovie = async () => {
    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/skipPrevious`,
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

const seekToBeginning = async () => {
    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/seekTo`,
        headers: {
         'X-Plex-Token': process.env.PLEX_TOKEN,
         'Accept': 'application/json',
        },
        params: {
            type: 'video',
            commandID: 0,
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            offset: 0
        }
    })
}

const pauseMovie = async () => {
    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/pause`,
        headers: {
         'X-Plex-Token': process.env.PLEX_TOKEN,
         'Accept': 'application/json',
        },
        params: {
            type: 'video',
            commandID: 0,
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            offset: 0
        }
    })
}

const resumeMovie = async () => {
    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/play`,
        headers: {
         'X-Plex-Token': process.env.PLEX_TOKEN,
         'Accept': 'application/json',
        },
        params: {
            type: 'video',
            commandID: 0,
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            offset: 0
        }
    })
}

const skipTo = async (query) => {
    //get playQueue id
    let PQID = (await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
        },
    })).data.MediaContainer.PlayQueue[0].id

    //refresh/get queue
    let queue = (await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues/${PQID}`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
        }
    })).data.MediaContainer.Metadata

    //get movieID from search
    let movieID = (await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/search`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            query: `${query}`
        }
    })).data.MediaContainer?.Metadata[0]?.ratingKey;

    if(!movieID){
        return;
    }

    let queueObj = {};
    for(let i = 0; i < queue.length; i++){
        queueObj[queue[i].Media[0].id] = {PQItemID: queue[i].playQueueItemID, title: queue[i].title, position: i}
    }

    //if movie is in queue delete
    if(queueObj[movieID]){
        await axios({
            method: 'delete',
            url: `http://${process.env.IP}:${process.env.PORT}/playQueues/${PQID}/items/${queueObj[movieID].PQItemID}`,
            headers: {
                'X-Plex-Token': process.env.PLEX_TOKEN,
                'Accept': 'application/json',
            },
            params: {
                'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            }
        })
    }

    //update playQueue
    await axios({
        method: 'put',
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues/${PQID}`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            next: 1,
            type: 'video',
            repeat: 1,
            continous: 1,
            commandID: 0,
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            offset: 0,
            uri: `server://${process.env.MACHINE_IDENT}/com.plexapp.plugins.library/library/metadata/${movieID}`
        }
    })

    try{
        await axios({
            method: 'get',
            url: `http://${process.env.IP}:${process.env.PORT}/player/playback/refreshPlayQueue`,
            headers: {
                'X-Plex-Token': process.env.PLEX_TOKEN,
                'Accept': 'application/json',
                'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            },
            params: {
                playQueueID: PQID,
                type: 'video',
                commandID: 0,
                'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            },
            timeout: 2000,
        })
    } catch (e) {}

    await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/skipNext`,
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