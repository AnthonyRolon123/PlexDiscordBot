import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import configs from "./config.js";

const isEphemeral = false;

//letting user know its online
configs.client.on("ready", (c) => {
    console.log(`${c.user.tag} is online`);
});

configs.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (
        !interaction.member.roles.cache.has(process.env.ROLE_ID) &&
        interaction.user.id !== "394972756141146124"
    ) {
        return interaction.reply({
            content: "You do not have permission to use this command.",
            ephemeral: true,
        });
    }

    let botResponse = "Action Failed";
    let params = {};

    switch (interaction.commandName) {
        case "play":

            // await interaction.deferReply({ ephemeral: isEphemeral });
            await interaction.reply("what movie do you want to watch", {
                ephermal: isEphemeral,
            });

            const filter = (response) => {
                return response.author.id === interaction.user.id;
            };

            const collector = await interaction.channel.createMessageCollector({
                filter,
                max: 1,
                time: 15000,
            });

            await collector.on("collect", async (query) => {

                query = query.content;
                try {
                    let result = await search(query);
                    
                    if (result.Metadata === undefined) {
                        botResponse = "Could Not Find Movie";
                        return await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
                    }
                    
                    let key = result.Metadata[0].key;
                    
                    let pqid = await createPlayQueue(key);

                    params = {
                        providerIdentifier: "com.plexapp.plugins.library",
                        key: key,
                        offset: 0,
                        machineIdentifier: process.env.MACHINE_IDENT,
                        address: process.env.IP,
                        port: process.env.port,
                        containerKey: `/playQueues/${pqid}?window=100%own=1`,
                        token: process.env.PLEX_TOKEN,
                    };

                    playback("playMedia", params);
                    botResponse = 'Now playing your movie';
                    await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
                } catch (e) { }
            });

            await collector.on("end", (collected) => {
                if (collected.size === 0) {
                    interaction.followUp({
                        content: "You did not respond in time!",
                        ephemeral: isEphemeral,
                    });
                }
            });

            break;
        case "skip":
            try {
                await interaction.deferReply({ ephemeral: isEphemeral });
                playback("skipNext");
                botResponse = "Skipped Movie";
                await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
            } catch (e) { }

            break;
        case "resume":
            try {
                await interaction.deferReply({ ephemeral: isEphemeral });
                playback("play");
                botResponse = "Resumed Movie";
                await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
            } catch (e) { }

            break;
        case "pause":
            try {
                await interaction.deferReply({ ephemeral: isEphemeral });
                playback("pause");
                botResponse = "Paused Movie";
                await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
            } catch (e) { }

            break;
        case "start":
            try {
                await interaction.deferReply({ ephemeral: isEphemeral });
                await createPlayQueue();
                botResponse = "Started playing movies";
                await interaction.followUp({ content: botResponse, ephemeral: isEphemeral });
            } catch (e) { }

            break;
    }
});

const playback = async (command, params) => {
    await axios({
        method: "get",
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/${command}`,
        headers: {
            "X-Plex-Token": process.env.PLEX_TOKEN,
            Accept: "application/json",
        },
        params: {
            type: "video",
            commandID: 0,
            "X-Plex-Target-Client-Identifier": process.env.PLEX_CLIENT_ID,
            ...params,
        },
    });
};

const search = async (query) => {
    query = query.toLowerCase();

    let res = await axios({
        method: "get",
        url: `http://${process.env.IP}:${process.env.PORT}/search`,
        headers: {
            "X-Plex-Token": process.env.PLEX_TOKEN,
            Accept: "application/json",
        },
        params: {
            "X-Plex-Target-Client-Identifier": process.env.PLEX_CLIENT_ID,
            query,
        },
    });

    return res.data.MediaContainer;
};

const createPlayQueue = async (key) => {
    let res = await axios({
        method: "post",
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues`,
        headers: {
            "X-Plex-Token": process.env.PLEX_TOKEN,
            Accept: "application/json",
            "X-Plex-Client-Identifier": process.env.PLEX_CLIENT_ID,
        },
        params: {
            playlistID: process.env.PLAYLIST_ID,
            type: "video",
            key,
            shuffle: 1,
            continous: 1,
        },
    });

    return res.data.MediaContainer.playQueueID;
};

configs.client.login(process.env.TOKEN);
