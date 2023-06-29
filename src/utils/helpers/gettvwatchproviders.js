async function gettvwatchproviders(inputs, exits) {
  const axios = require("axios");
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${inputs.tmdb_id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`,
    headers: {},
  };

  await axios
    .request(options)
    .then((response) => exits.success(response.data))
    .catch((error) => {
      console.error(error);
    });
}
