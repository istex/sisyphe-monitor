![sisyphe](./logo-sisyphe.jpg)

## Sisyphe-monitor

Sisyphe-monitor is a front-end command line for the [Sisyphe](https://github.com/istex/sisyphe)  application. It displays information about the progress of the analysis.

### Requirements
Test with NodeJS@8.1, Redis@3.2.6


### Install it

1. Download the lastest [Sysiphe](https://github.com/istex/sisyphe)  version and refer to the Readme to install it
2. Download the lastest Sisyphe-monitor version
2. Just do : `npm install`
3. ... that's it.

### Test

`npm run test` Will test sisyphe-monitor

### Help

`./app.js --help` Will output help

### Options
    -V, --version           output the version number
    -r, --refresh <number>  Rate to refresh interface (ms)
    -u, --url <name>        Define the remote to redis
    -p, --prefix <name>     Define the prefix for redis
    -h, --help              output usage information
    
### How it works ?

Just start Sisyphe-sisyphe like this:

`npm start -- -p bull -r 1000`  Prefix with bull and refresh every 1000ms on localhost

Sisyphe start and wait for keys in redis
![sisyphe](./flow.gif)