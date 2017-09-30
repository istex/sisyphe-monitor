const program = require('commander');
program
  .command('module', 'Manage modules', { isDefault: true })
  .parse(process.argv);
