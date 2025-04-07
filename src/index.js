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

    if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
        return interaction.reply({content: 'You do not have permission to use this command.', ephemeral: true  });
    };

    let playing;

    switch(interaction.commandName)
    {
        case 'skip':
            await interaction.deferReply({ ephemeral: isEphemeral });

            try {
                skipMovie();
            } catch (e) {}

            await refreshPlayQueue();

            interaction.followUp({content: `Skipped`, ephemeral: isEphemeral  });
            break;
        case 'previous':
            await interaction.deferReply({ ephemeral: isEphemeral });
            try {
                await seekToBeginning();
                previousMovie();
            } catch (e) {}
            await refreshPlayQueue();

            interaction.followUp({content: `Playing previous movie`, ephemeral: isEphemeral  });
            break;
        case 'restart': 
            await interaction.deferReply({ ephemeral: isEphemeral });
            try {
                seekToBeginning();
            } catch (e) {}
            interaction.followUp({content: `Restarting Movie`, ephemeral: isEphemeral  });
            break;
        case 'nothing':
            break;
        case 'resume': 
            await interaction.deferReply({ ephemeral: isEphemeral });
            try {
                resumeMovie();
            } catch (e) {}
            interaction.followUp({content: `Resuming Movie`, ephemeral: isEphemeral  });
            break;
        case 'pause': 
            await interaction.deferReply({ ephemeral: isEphemeral });
            try {
                await pauseMovie();
            } catch (e) {}
            interaction.followUp({content: `Pausing Movie`, ephemeral: isEphemeral  });
            break;
        case 'play':
            await interaction.reply(`not working atm`, {ephemeral: isEphemeral  })
            break;
            interaction.reply('what movie do you want to watch', {ephermal: isEphemeral});

            const filter = (response) => {
                return response.author.id === interaction.user.id
            }

            const collector = interaction.channel.createMessageCollector({ filter, time: 15000});

            collector.on('collect', async (query) => {
                try {
                    await skipTo(query);
                } catch (e) {
                }
                await refreshPlayQueue();
                playing = await nowPlaying();
                await interaction.followUp({content: `Playing ${playing}`, ephemeral: isEphemeral  })
            })

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.followUp({content: 'You did not respond in time!', ephemeral: isEphemeral  });
                }
            });

            break;
        case 'now':
            if(!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: isEphemeral });
            };
            await interaction.deferReply({ ephemeral: isEphemeral });
            try {
                playing = await nowPlaying();
            } catch (e) {}

            interaction.followUp({content: `Playing ${playing}`, ephemeral: isEphemeral  });
            break;
        case 'search':
            interaction.reply('what movie do you want to search for', {ephermal: isEphemeral});

            filter = (response) => {
                return response.author.id === interaction.user.id
            }

            collector = interaction.channel.createMessageCollector({ filter, time: 15000});

            collector.on('collect', async (query) => {
                try {
                    await skipTo(query);
                } catch (e) {
                }
                await refreshPlayQueue();
                playing = await nowPlaying();
                interaction.followUp({content: `Playing ${playing}`, ephemeral: isEphemeral  })
            })

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.followUp({content: 'You did not respond in time!', ephemeral: isEphemeral  });
                }
            });

            break;
    }
});

const skipMovie = async () => {
    try {
        await axios({
            method: 'get',
            timeout: 2000,
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
    } catch (error) {}
}

const previousMovie = async () => {
    await axios({
        timeout: 5000,
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
        timeout: 2000,
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
        timeout: 2000,
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
        timeout: 2000,
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

const refreshPlayQueue  = async () => {
    let PQID = (await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
        },
    })).data.MediaContainer.PlayQueue[0].id

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
}

const skipTo = async (query) => {
    //get playQueue id
    let PQID = await (await axios({
        timeout: 2000,
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
        },
    })).data.MediaContainer.PlayQueue[0].id

    //refresh/get queue
    let queue = await (await axios({
        timeout: 2000,
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
    let movieID = await (await axios({
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
        throw new Error('could not find movie')
    }

    let queueObj = {};
    for(let i = 0; i < queue.length; i++){
        queueObj[queue[i].Media[0].id] = {PQItemID: queue[i].playQueueItemID, title: queue[i].title, position: i}
    }

    //if movie is in queue delete
    if(queueObj[movieID]){
        await axios({
        timeout: 2000,
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
        timeout: 2000,
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
    } catch (e) {console.log(e)}

    await axios({
        timeout: 2000,
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

const nowPlaying = async () => {
    try {
        let res = await axios({
            method: 'get',
            url: `http://${process.env.IP}:${process.env.PORT}/status/sessions`,
            headers: {
                'X-Plex-Token': process.env.PLEX_TOKEN,
                'Accept': 'application/json',
                'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
            },
        })
        return res.data.MediaContainer.Metadata[0].title;
    } catch (error) {
        return 'idk';
    }
    
}

configs.client.login(process.env.TOKEN);