# Internet Speed Logger

This is an fork of https://github.com/brennentsmith/internet-speed-logger with less database requirements updated dependencies and some finetuning.

_An application to track your internet download and upload speeds with an elegant web interface._

![Preview of Internet Speed Logger](https://i.imgur.com/LhtHxpZ.gif)

This is a time series based application which continuously monitors your internet connection and plots the results within a responsive web view along with providing basic aggregation of the current visible timeframe (mean). This leverages the [official Speedtest.net CLI binary](https://www.speedtest.net/apps/cli) from Ookla to provide the best performance possible.

An early version of this service has been running for many years (~2016) and it has been instrumental for tracking internet performance issues.

To bring it online, simply run:
```
git clone https://github.com/brennentsmith/internet-speed-logger-sqlite.git
cd internet-speed-logger-sqlite
<< download latest version of Speedtest-CLI binary to `bin` dir within repo >>
npm ci
forever start index.js
forever start run-speedtest.js daemon
```

The sqlite datafile can deleted anytime, it will recreated at runtime.

You can view or edit logged data with any sqlite tool you like in the data folder configured. 
For example:
- sqlitestudio (https://sqlitestudio.pl/) or DBeaver (https://dbeaver.io/) 

## Updating
```
cd internet-speed-logger-sqlite
git pull
npm update
```

## Components

The requirements for Internet Speed Logger are:
- NodeJS 12-LTS or newer

There are two core components to running Internet Speed Logger:
- Webserver (`/index.js`) - Webserver which delivers static assets and provides API. 
- Speedrunner (`/run-speedtest.js`) - Daemon or One Shot process which performs the internet speed test.

The Webserver must always be running, however the Speedrunner can be either run as a daemon `/run-speedtest.js daemon` or invoked via cron or SystemD timer as a oneshot process `/run-speedtest.js`. Both the Webserver and Speedrunner share the common config within `/config/default.js`.

## Configuration

All configuration is held within the `/config/default.json` file. The following options are available:

| Leaf | Default | Description |
| -- | -- | -- |
| `webserver.listenPort`      | `3000`       | Port which the webserver will listen on   |
| `webserver.listenHost`      | `0.0.0.0`       | Host which the webserver will listen on   |
| `db.databasefile`   | `data/speedtest.sqlite`        | path to store sqlite database file      |
| `db.collection`      | `speedtest`       | Collection to use within database.   |
| `speedtest.commandString`      | `bin/speedtest -f json --accept-license`       | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server.  use \\ on windows git bash |
| `speedtest.intervalSec`      | `43200`       | Interval for which the speedtest will be run. This will be randomly skewed +/- 25% and limited to no less than 300 (5 minutes) seconds between runs.   |

## Running Internet Speed Logger

### Forever
Install the following:
- NodeJS: https://nodejs.org/en/download/package-manager/ 
- Forever: https://www.npmjs.com/package/forever (optional) 

```
git clone https://github.com/brennentsmith/internet-speed-logger-sqlite.git
cd internet-speed-logger-sqlite
<< download latest version of Speedtest-CLI binary to `bin` dir within repo >>
npm ci
forever start index.js
forever start run-speedtest.js daemon
```
