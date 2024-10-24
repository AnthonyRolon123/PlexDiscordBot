import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const pause = async () => {
    let res = await axios({
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
            // offset: 0
        },
        // timeout: 5000
    })

    console.dir(res.data, {depth: 99});
}

// let res = await axios({
//     method: 'get',
//     url: `http://${process.env.IP}:${process.env.PORT}/playQueues/`,
//     headers: {
//      'X-Plex-Token': process.env.PLEX_TOKEN,
//      'Accept': 'application/json',
//      'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
//     },
//     // params: {
//     //     type: 'video',
//     //     commandID: 0,
//         // offset: 0
//     // },
//     // timeout: 5000
// })

const main = async () => {
    try {
        let res = await axios({
            method: 'get',
            url: `http://${process.env.IP}:${process.env.PORT}/player/playback/skipNext`,
            headers: {
             'X-Plex-Token': process.env.PLEX_TOKEN,
            //  'Accept': 'application/json',
            },
            params: {
                type: 'video',
                commandID: 0,
                'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
                offset: 0
            },
            timeout: 5000
        })
        console.dir(res.data, {depth: 99})
    } catch (e) {}

    let res1 = await axios({
            method: 'get',
            url: `http://${process.env.IP}:${process.env.PORT}/status/sessions`,
            headers: {
                'X-Plex-Token': process.env.PLEX_TOKEN,
                'Accept': 'application/json',
                'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
            },
        })
        
        console.dir(res1.data, {depth: 99})
}

// let res = await axios({
//     method: 'get',
//     url: `http://${process.env.IP}:${process.env.PORT}/status/sessions`,
//     headers: {
//         'X-Plex-Token': process.env.PLEX_TOKEN,
//         'Accept': 'application/json',
//         'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
//     },
// })

// console.dir(res.data, {depth: 99})

// await pause();
await main();