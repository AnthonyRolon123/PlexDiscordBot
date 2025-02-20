import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const main = async () => {

    // await axios({
    //     // timeout: 2000,
    //     method: 'put',
    //     url: `http://${process.env.IP}:${process.env.PORT}/sync`,
    //     headers: {
    //         'X-Plex-Token': process.env.PLEX_TOKEN,
    //         'Accept': 'application/json',
    //     },
    //     params: {
    //         type: 'video',
    //         commandID: 0,
    //         'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
    //     }
    // })

    let res = await axios({
        method: 'get',
        url: `http://${process.env.IP}:${process.env.PORT}/search`,
        headers: {
            'X-Plex-Token': process.env.PLEX_TOKEN,
            'Accept': 'application/json',
        },
        params: {
            'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
            query: `the matrix`
        }
    })

    //'/library/metadata/6414'
    //ratingKey: '6414'

    // let res = await axios({
    //     // timeout: 2000,
    //     method: 'get',
    //     url: `http://${process.env.IP}:${process.env.PORT}/status/sessions`,
    //     headers: {
    //         'Accept': 'application/json',
    //         'X-Plex-Token': process.env.PLEX_TOKEN,
    //     },
    //     params: {
    //         // type: 'video',
    //         // commandID: 0,
    //         // offset: 0,
    //         'X-Plex-Target-Client-Identifier': process.env.PLEX_CLIENT_ID,
    //     }
    // })

    console.dir(res.data, {depth: 99});
    // console.log(res.data.MediaContainer.Metadata[0]);
    console.log('done');
}

await main();