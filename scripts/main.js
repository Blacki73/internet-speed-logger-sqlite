/* eslint-env jquery, browser */

const container = document.getElementById('visualization');
// eslint-disable-next-line no-undef
const groups = new vis.DataSet();
let debounceGlobal = true;
const options = {
  locale: 'de',
  start: new Date().getTime() - 24 * 60 * 60 * 1000,
  end: new Date().getTime() + 60 * 60 * 1000,
  height: '100%',
  legend: true,
  showCurrentTime: true,
  zoomMax: 315360000000,
  zoomMin: 3600000,
  maxMinorChars: 15,
  dataAxis: {
    showMinorLabels: true,
  },
};

groups.add({
  id: '0',
  content: 'Download - Mbps',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: '1',
  content: 'Upload - Mbps',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: '2',
  content: 'Ping - Milliseconds',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

groups.add({
  id: '3',
  content: 'Jitter - Milliseconds',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});
groups.add({
  id: '4',
  content: 'Loss - Packages %',
  options: {
    drawPoints: {
      style: 'circle', // square, circle
    },
    shaded: {
      orientation: 'bottom', // top, bottom
    },
  },
});

function convertTime(val) {
  if (typeof val !== 'number') {
    const d = Date.parse(val);
    return d.toString();
  }
  return val;
}

function normalizeAvg(val) {
  return val === null ? '-' : val.toFixed(2);
}

function rangeChanged(event) {
  if (!debounceGlobal) { return; }

  const params = {
    start: convertTime(event.start),
    end: convertTime(event.end),
  };
  const URLparams = new URLSearchParams(Object.entries(params));

  fetch(`/api/avg?${URLparams.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      let legendText = {
        down: '-',
        up: '-',
        ping: '-',
        jitter: '-',
        loss: '-',
      };
      if (data.length > 0) {
        legendText = {
          down: `Avg. ${normalizeAvg(data[0].avgd)}`,
          up: `Avg. ${normalizeAvg(data[0].avgu)}`,
          ping: `Avg. ${normalizeAvg(data[0].avgp)}`,
          jitter: `Avg. ${normalizeAvg(data[0].avgj)}`,
          loss: `Avg. ${normalizeAvg(data[0].avgl)}`,
        };
      }

      document.querySelector('.vis-legend-stats #avg-download').textContent = legendText.down;
      document.querySelector('.vis-legend-stats #avg-upload').textContent = legendText.up;
      document.querySelector('.vis-legend-stats #avg-ping').textContent = legendText.ping;
      document.querySelector('.vis-legend-stats #avg-jitter').textContent = legendText.jitter;
      document.querySelector('.vis-legend-stats #avg-loss').textContent = legendText.loss;
    });
  debounceGlobal = false;
  setTimeout(() => {
    debounceGlobal = true;
  }, 300);
}

fetch('/api/')
  .then((response) => response.json())
  .then((data) => {
    if (data.length === 0) {
      const a = document.createElement('div');
      a.append('No Data Found in Database - The first test may be in progress.');
      a.classList.add('vis-legend-text', 'vis-legend-stats');
      document.querySelector('body').append(a);
      return;
    }
    // eslint-disable-next-line no-undef
    const dataset = new vis.DataSet(data);
    // eslint-disable-next-line no-undef
    const Graph2d = new vis.Graph2d(container, dataset, groups, options);
    function onMouseover(event) {
      // properties contains things like node id, group, x, y, time, etc.
      if (event.event.target.nodeName == 'circle') {
        props = Graph2d.getEventProperties(event);
        if (props.event.what == 'background') {
          { console.log('point value:', props.event.value[0]); }
        }
      }
    }
    Graph2d.on('click', onMouseover);
    /*
    function onMouseout(event) {
      // properties contains things like node id, group, x, y, time, etc.
      if (event.target.tagName === 'circle' && event.target.classList.contains('vis-point')) {
        { console.log('mouseout:', event.which, event.target); }
      }
    }
    Graph2d.on('mouseout', onMouseout);
    container.addEventListener('mouseover', onMouseover);
    container.addEventListener('mouseout', onMouseout);
*/
    const b = document.createElement('div');
    b.classList.add('vis-legend-text', 'vis-legend-stats');
    b.innerHTML = '<span id="avg-download"></span><span id="avg-upload"></span><span id="avg-ping"></span><span id="avg-jitter"></span><span id="avg-loss"></span>';
    document.querySelector('.vis-legend').append(b);

    Graph2d.on('rangechanged', rangeChanged);
    rangeChanged(options);
    let loadTime = new Date().getTime();

    window.setInterval(() => {
      const earlyLoadTime = new Date().getTime();
      fetch(`/api?sd=${loadTime}`)
        .then((response) => response.json())
        .then((output) => {
          if (output.length > 0) {
            // datavis will automatically deduplicate via ID
            loadTime = earlyLoadTime;
            dataset.update(output);
            rangeChanged(options);
          }
        });
    }, 5000);
  });
