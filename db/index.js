const config = require('config');
const sqlite3 = require('sqlite3').verbose();

const sqlitedb = config.get('db.databasefile');
const tableName = config.get('db.collection');

function connect(url) {
  const db = new sqlite3.Database(url);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (date TEXT, ping REAL, download REAL, upload REAL, jitter REAL, loss REAL)`);
  });
  return db;
}

module.exports = async () => {
  const database = await Promise.all([connect(sqlitedb, {
    poolSize: 10,
  })]);
  return database;
};
