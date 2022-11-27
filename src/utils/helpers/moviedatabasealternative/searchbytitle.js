

async function searchbytitle(searchString, pageNum = 1) {
 
  const axios = require("axios")

  const options = {
    method: 'GET',
    url: 'https://movie-database-alternative.p.rapidapi.com/',
    params: {s: searchString, r: 'json', page: pageNum},
    headers: {
      'X-RapidAPI-Key': process.env.MOVIE_DBA_KEY,
      'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
    }
  };
  
  axios.request(options).then(function (response) {
    return response.data
  }).catch(function (error) {
    console.error(error);
  });
      
    return searchResult
  }

  module.exports = {
    searchbytitle
  }