async function findbyimdbid(inputs, exits) {
  const axios = require("axios");
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/find/${inputs.imdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&external_source=imdb_id`,
    headers: {},
  };

  await axios
    .request(options)
    .then((response) => exits.success(response.data))
    .catch((error) => {
      console.error(error);
    });
}
