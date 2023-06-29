async function gettvdetails(inputs, exits) {
  const axios = require("axios");
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${inputs.show_id}?api_key=47e95b6f1f16930b4bab4ac1677815c7&language=en-US`,
    headers: {},
  };

  await axios
    .request(options)
    .then((response) => exits.success(response.data))
    .catch((error) => {
      console.error(error);
    });
}
