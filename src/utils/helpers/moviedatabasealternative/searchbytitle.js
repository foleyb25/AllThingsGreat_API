async function searchbytitle(searchString, pageNum) {
  const axios = require('axios')
  const options = {
      method: 'GET',
      url: 'https://movie-database-alternative.p.rapidapi.com/',
      params: {s: searchString, r: 'json', page: pageNum},
      headers: {
        'X-RapidAPI-Key': process.env.MOVIE_DBA_KEY,
        'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
      }
    };
    console.log("Making request")
    const searchResult = await axios.request(options).then( async function (response) {
      if(response.data.Response == 'False') {
        return response.data.Error
      }

        return response.data.Search
        
    }).catch(function (error) {
        console.error(error);
    });
      
    return searchResult
  }

  module.exports = {
    searchbytitle
  }