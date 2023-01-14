# AllThingsGreat-API

---

## Description
All Things Great is a place where people go to escape the the BS of the Main Stream Media. We aim to write with a high degree of creativity, wittiness, sarcasm, informativeness, and topics that leave the reader with a boost a confidence. We steer clear from politics, unless a joke comes to be, to make for the last best place on the internet.

We indulge in locker room talk and walk on the hot coals of twisted humor. Covering sports, achievements, history, entertainment, and topics that make up of greatness - with our own unique tone behind it.

This is the All Things Great experience.

## Application
Currently, the application is going through a complete revamp ranging from the front end, API, and DB Schema. Please stay tuned for the official re-release.

This is the Application Programming interface that works as a liason between the two front-end applications, [AllThingsGreat](https://github.com/foleyb25/AllThingsGreat) and [AllThingsGreat-Writer](https://github.com/foleyb25/AllThingsGreat-Writer), and the DB. The All Things Great API also reaches out to other 3rd party API's for data, such as [TMDB](https://www.themoviedb.org/?language=en-US)

Auth0-GUIDE: https://developer.auth0.com/resources/guides/spa/vue/basic-authentication#quick-vue-js-setup

- Command to get docker local container running: docker run --env-file=.env -dp 5002:5002 brian_foley/all-things-great-api

Make sure you are in /server directory to pull .env file