import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const nowPlaying = async () => {

    let res = await axios({
        method: "get",
        // timeout: 2000,
        url: `http://${process.env.IP}:${process.env.PORT}/status/sessions`,
        headers: {
            "X-Plex-Token": process.env.PLEX_TOKEN,
            Accept: "application/json",
        },
        params: {
            type: "video",
            commandID: 0,
            "X-Plex-Target-Client-Identifier": process.env.PLEX_CLIENT_ID,
            // ...params,
        },
    });

    return res.data.MediaContainer.Metadata[0].title;
}



// await main();
console.dir(await nowPlaying(), {depth: 99});
// console.log(await nowPlaying());
