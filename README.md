
## Sisyphe-monitor
![sisyphe](./logo-sisyphe.jpg)

Sisyphe-monitor is a front-end command line for the [Sisyphe](https://github.com/istex/sisyphe)  application. It displays information about the progress of the analysis.


![sisyphe](./flow.gif)

### Requirements
Test with NodeJS@8.1, Redis@3.2.6


### Install it

 - Download the lastest [Sisyphe](https://github.com/istex/sisyphe)  version and refer to the Readme to install it
 - Download the lastest Sisyphe-monitor [release](https://github.com/istex/sisyphe-monitor/releases/latest)
 - Execute Sisyphe-monitor
 - ... that's it.
 
If the server is not running on Sisyphe, you can not control it. Sisyphe-monitor asks you to start the server to access certain actions. 
But you can use it without server, sisyphe-monitor watch redis to display progressions


### Features

 - View global progression
 - View modules progression
 - View time of analyse
 - View Sisyphe status
 - View logs
 - Launch analyse with parameters 
 - Manipulate modules (activate/desactivate)
 - Download latest analyse 
 - Stop analyse
 - Activate debug mode on server
 
### Help

`./app.js --help` Will output help

### Options
    -V, --version           output the version number
    -r, --refresh <number>  Rate to refresh interface (ms)
    -u, --url <name>        Define the remote to redis
    -p, --prefix <name>     Define the prefix for redis
    -h, --help              output usage information
