import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const main = async () => {
    let res = await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/`,
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

await main();