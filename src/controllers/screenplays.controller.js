/*
Controller for Screenplay CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib");
const screenplayService = require("../services/screenplays.service.js");

async function searchScreenplays(req, res) {
  const { pageNum } = req.params;
  const { searchString } = req.params;
  const screenplays = await screenplayService.getMultipleSearch(
    searchString,
    pageNum
  );
  return res.status(200).json(screenplays);
}

module.exports = autoCatch({
  searchScreenplays,
});
