  async function getmoviedetails(inputs, exits) {
    const axios = require("axios");
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${inputs.screenplay_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US+`,
        headers: {

        }
      };
      
      await axios.request(options).then(function (response) {
          return exits.success(response.data)
      }).catch(function (error) {
          console.error(error);
      });
    

  }
