const cheerio = require('cheerio');
const program = require('commander');
const pkg = require('../package.json');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ncp = Promise.promisifyAll(require('ncp'));
const path = require('path');
program
  .version(pkg.version)
  .option('-c, --controller <name>', 'Controller name', 'none')
  .option('-n, --moduleName <name>', 'Module name', 'none')
  .usage('[options] <path>')
  .parse(process.argv);

if (program.moduleName === 'none' || program.controller === 'none') {
  program.outputHelp();
  process.exit(0);
}

const referencePath = path.resolve('script', 'Reference');
const modulePath = path.resolve('src', 'modules', program.moduleName);
const modulePathRelative = './src/modules/';
const launch = async function () {
  if (fs.existsSync(modulePath)) throw new Error(`The module ${program.moduleName} exist !`);
  console.log(`create resources for ${program.moduleName}`);
  await ncp.ncpAsync(referencePath, modulePath);
  console.log(`rename resources for ${program.moduleName}`);
  await fs.renameAsync(
    path.join(modulePath, 'controller.js'),
    path.join(modulePath, `${program.controller}.js`)
  );
  await fs.renameAsync(
    path.join(modulePath, 'view.html'),
    path.join(modulePath, `${program.moduleName}.html`)
  );
  console.log(`adapt content for ${program.moduleName}`);
  const files = await fs.readdirAsync(modulePath);
  files.map(async file => {
    const newContent = await fs
      .readFileAsync(path.resolve(modulePath, file), 'utf8')
      .then(fileContent => {
        fileContent = replaceAll(
          fileContent,
          '{{Controller}}',
          program.controller
        );
        fileContent = replaceAll(
          fileContent,
          '{{ModuleName}}',
          program.moduleName
        );
        return fileContent;
      });
    await fs.writeFileAsync(path.join(modulePath, file), newContent);
  });
  console.log(`link module to app`);
  await fs.appendFileAsync(
    path.join('src', 'app.js'),
    `const ${program.moduleName} = require('${modulePathRelative}${program.moduleName}/app');`
  );
  await fs.appendFileAsync(
    path.join('src', 'app.js'),
    `${program.moduleName}.init(ang); \n`
  );
  console.log(`link module to navbar view`);
  putInNavbar(program);
  console.log(`link module to home view`);
  putInHome(program);
};

function putInNavbar (program) {
  const $ = cheerio.load(
    fs.readFileSync(path.resolve('views', '_navbar.html'))
  );
  const $sidebar = $('.sidebar')
  .append(
    `  <a class="item" ui-sref="${program.moduleName}" ng-click="changeModule('${program.moduleName}')">\n` +
    `    <i class="fa fa-picture-o" aria-hidden="true"></i>\n` +
    `    ${program.moduleName}\n` +
    `  </a>\n`
  )
  .parent();
  fs.writeFileSync(path.resolve('views', '_navbar.html'), $sidebar.html());
}
function putInHome (program) {
  const $ = cheerio.load(
    fs.readFileSync(path.resolve('views', 'home.html'))
  );
  const $home = $('.container')
    .append(
      `    <div ui-view="${program.moduleName}"   class="row centered module" ng-if="$state.current.name == '${program.moduleName}'" ></div>\n`
    )
    .parent().parent();
  fs.writeFileSync(path.resolve('views', 'home.html'), $home.html());
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp (str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

launch()
  .then(_ => {
    console.log('done !');
  })
  .catch(err => {
    console.log(err);
  });
