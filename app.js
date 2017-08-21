#!/usr/bin/env node
const program = require('commander');
const Monitor = require('./src/monitor');
const version = require('./package.json').version;

program
  .version(version)
  .usage('[options] <path>')
  .option('-r, --refresh <number>', 'Rate to refresh interface (ms)')
  .option('-u, --url <name>', 'Define the remote to redis')
  .option('-p, --prefix <name>', 'Define the prefix for redis')
  .parse(process.argv);

const prefix = program.prefix || 'sisyphe';
const refresh = program.refresh || 40;
const host = program.url || 'localhost';
const monitor = new Monitor({
  host,
  refresh,
  prefix
});
monitor.launch();
