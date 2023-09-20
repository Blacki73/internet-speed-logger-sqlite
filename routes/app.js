/* eslint radix: ["error", "as-needed"] */
function bulkAPI(req, res, dbs) {
  let query = {};
  if (typeof req.query.sd !== 'undefined') {
    query = {
      string: 'SELECT rowid as _id, * FROM speedtest WHERE UNIXEPOCH(date) >= ?',
      data: [parseInt(req.query.sd) / 1000],
    };
  } else {
    query = {
      string: 'SELECT rowid as _id, date, ping, download, upload, jitter, loss FROM speedtest where 1=?',
      data: [1],
    };
  }
  const data = [];
  dbs[0].all(query.string, query.data, (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      // TODO: Make this data transformation cleaner
      const struct = {
        0: Object.is(row.download, undefined) ? null : row.download,
        1: Object.is(row.upload, undefined) ? null : row.upload,
        2: Object.is(row.ping, undefined) ? null : row.ping,
        3: Object.is(row.jitter, undefined) ? null : row.jitter,
        4: Object.is(row.loss, undefined) ? null : row.loss,
      };
      for (let j = 0; j < Object.keys(struct).length; j += 1) {
        if (struct[j] !== null) {
          const dataPoint = {
            // eslint-disable-next-line no-underscore-dangle
            id: `${row._id}${j}`,
            x: row.date,
            y: struct[j],
            group: j,
          };
          data.push(dataPoint);
        }
      }
    });
    res.send(JSON.stringify(data));
  });
}

async function avgAPI(req, res, dbs) {
  const endDate = (typeof req.query.end !== 'undefined') ? parseInt(req.query.end) / 1000 : Date.now();
  const afterDate = (typeof req.query.start !== 'undefined') ? parseInt(req.query.start) / 1000 : 0;

  dbs[0].all('SELECT "speedtest" as _id, avg(ping) as avgp, avg(download) as avgd, avg(upload) as avgu, avg(jitter) as avgj, avg(loss) as avgl FROM speedtest WHERE UNIXEPOCH(date) > ? and UNIXEPOCH(date) <= ?', [afterDate, endDate], (err, rows) => {
    res.send(rows);
  });
}

module.exports = (app, dbs) => {
  app.get('/api/', (req, res) => {
    bulkAPI(req, res, dbs);
  });

  app.get('/api/avg/', (req, res) => {
    avgAPI(req, res, dbs);
  });
  return app;
};
