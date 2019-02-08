// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const m = require('./db/mongoose');
const client = require('./db/pg');

(async function startDbThenServer() {
  await client.startDB();
  await m.startDB();

  await app.listen(port, () => {
    console.log(`App running on port ${port} (${env}).`);
  });
}());


// open mongoose connection
//mongoose.connect();

/**
* Exports express
* @public
*/
module.exports = app;
