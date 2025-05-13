// import dotenv from 'dotenv';
// dotenv.config();
// import axios from 'axios';

// const nowPlaying = async () => {
//     let res = await axios({
//         timeout: 20000,
//         method: 'get',
//         url: `https://community.plex.tv/api/`,
//         headers: {
//             'X-Plex-Token': process.env.PLEX_TOKEN,
//             'Accept': 'application/json',
//             // 'X-Plex-Client-Identifier': process.env.PLEX_CLIENT_ID,
//         },
//     })

//     return res.data.MediaContainer.Metadata[0].title;
// }

// // await main();
// console.log(await nowPlaying());

let n = 5000

let answer = 12;
let result = n;

// if(n === 1){
//     return answer;
// }

while(n > 0){
    result *= n-1;
    n = n-1;
  }

// answer = 72 * result;



console.log(result%Math.pow(10,9)) + 7