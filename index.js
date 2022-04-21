
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { PORT } = process.env;
const LoadDb = require('./src/helpers/loadDb')


// Syncing all the models at once.
conn.sync({ force: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening at port ${PORT}`);
    })
  }).then(() => {
    LoadDb();
  })
  .catch((err) => {
    console.log(err.message);
  });