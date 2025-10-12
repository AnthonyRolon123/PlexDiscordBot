import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const nowPlaying = async () => {

    let key = await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/search`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            query: 'bee movie',
        }
    })

    if(!"MetaData" in key.data){
        return 'Could not find movie';
    }
    
    key = key.data.MediaContainer.Metadata[0].key;

    let pqid = await axios({
        method: 'post',
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/playQueues`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
        },
        params: {
            playlistID: process.env.PLAYLIST_ID,
            type: 'video',
            key,
            shuffle: 1,
            continous: 1,
        }
    })

    pqid = pqid.data.MediaContainer.playQueueID;

    let test = await axios({
        method: 'get',
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/player/playback/playMedia`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
        },
        params: {
            'providerIdentifier': 'com.plexapp.plugins.library',
            key: key,
            offset: 0,
            machineIdentifier: process.env.MACHINE_IDENT,
            address: process.env.IP,
            port: process.env.port,
            type: 'video',
            commandID: 0,
            containerKey: `/playQueues/${pqid}?window=100%own=1`,
            token: process.env.PLEX_TOKEN
        }
    })

    return test.data;
}


// await main();
console.dir(await nowPlaying(), {depth: 99});
// console.log(await nowPlaying());
