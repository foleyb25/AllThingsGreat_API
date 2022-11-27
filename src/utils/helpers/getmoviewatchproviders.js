async function getmoviewatchproviders(inputs, exits) {
    const axios = require("axios");
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${inputs.tmdb_id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`,
        headers: {

        }
      };
      
      await axios.request(options).then(function (response) {
          return exits.success(response.data)
      }).catch(function (error) {
          console.error(error);
      });
    

  }
