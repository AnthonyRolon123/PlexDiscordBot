import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const nowPlaying = async () => {

    let res = await axios({
        method: 'get',
        // timeout: 2000,
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

    return res.data;
}

const play = async () => {
    let res = await axios({
        method: 'get',
        url: `http://${process.env.IP}:32400/:/timeline`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
            'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
            'X-Plex-Session-Identifier': process.env.PLEX_CLIENT_ID
        },
        params: {
            // includeRelay: 1,
            // includeHttps: 1
            // playQueueItemID: 222382,
            time: 0,
            state: 'paused',
            // continuing: 1,

        }
    })

    return res.data;
}

// await main();
console.dir(await nowPlaying(), {depth: 99});
// console.log(await nowPlaying());

// console.log(await play());
// console.dir(await play(), { depth: 99});
