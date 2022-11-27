async function findbyimdbid(inputs, exits) {
  const axios = require("axios");
  const options = {
    method: 'GET',
    url: 'https://movie-database-alternative.p.rapidapi.com/',
    params: {r: 'json', i: inputs.imdb_id},
    headers: {
      'X-RapidAPI-Key': process.env.MOVIE_DBA_KEY,
      'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
    }
  };

  await axios.request(options).then( async function (response) {
      return exits.success(response.data)
      
  }).catch(function (error) {
      console.error(error);
  });
    

}
