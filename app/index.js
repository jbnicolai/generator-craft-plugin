'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var renamer = require('renamer');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stunning ' + chalk.red('Craft plugin') + ' generator!'
    ));

    var handleDefault = function(answers) {
      return this._.classify(answers.pluginName);
    };

    var prompts = [
      {
        type: 'input',
        name: 'pluginName',
        message: 'Plugin name',
        default: 'My Plugin'
      },
      {
        type: 'input',
        name: 'pluginHandle',
        message: 'Plugin handle (e.g. MyPlugin)',
        default: handleDefault.bind(this)
      },
      {
        type: 'input',
        name: 'pluginVersion',
        message: 'Intial version number',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'pluginDir',
        message: 'Craft plugin directory',
        default: 'craft/plugins',
      },
      {
        type: 'confirm',
        name: 'useComposer',
        message: 'Would you like to use Composer?',
        default: true
      },
      {
        type: 'input',
        name: 'developerName',
        message: 'Developer Name',
        store: true,
      },
      {
        type: 'input',
        name: 'developerUrl',
        message: 'Developer URL',
        store: true,
      }
    ];

    this.prompt(prompts, function (props) {

      for (var prop in props) {
        this[prop] = props[prop];
      }

      // For directory, NPM, Composer
      this.pluginHandleLower = props.pluginHandle.toLowerCase();
      this.pluginHandleSlugged = this._.slugify(props.pluginName);

      done();
    }.bind(this));
  },

  writing: {
    pluginFiles: function () {
      var pluginDest = path.join(this.pluginDir, this.pluginHandleLower);
      var generator = this;

      fs.exists(pluginDest, function (exists) {
        if (exists) {
          generator.log(chalk.red('Cannot proceed. A plugin folder already exists at: ') + pluginDest);
          process.exit();
        }
      });

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath(path.join(pluginDest, '.editorconfig'))
      );
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath(path.join(pluginDest, 'package.json')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_composer.json'),
        this.destinationPath(path.join(pluginDest, 'composer.json')),
        this
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath(path.join(pluginDest, '.editorconfig'))
      );
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath(path.join(pluginDest, 'package.json')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_composer.json'),
        this.destinationPath(path.join(pluginDest, 'composer.json')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/PluginHandlePlugin.php'),
        this.destinationPath(path.join(pluginDest, 'PluginHandlePlugin.php')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/controllers/*'),
        this.destinationPath(path.join(pluginDest, 'controllers')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/elementactions/*'),
        this.destinationPath(path.join(pluginDest, 'elementactions')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/fieldtypes/*'),
        this.destinationPath(path.join(pluginDest, 'fieldtypes')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/migrations/*'),
        this.destinationPath(path.join(pluginDest, 'migrations')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/models/*'),
        this.destinationPath(path.join(pluginDest, 'models')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/records/*'),
        this.destinationPath(path.join(pluginDest, 'records')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/resources/*'),
        this.destinationPath(path.join(pluginDest, 'resources')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/services/*'),
        this.destinationPath(path.join(pluginDest, 'services')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/templates/*'),
        this.destinationPath(path.join(pluginDest, 'templates')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/translations/*'),
        this.destinationPath(path.join(pluginDest, 'translations')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/variables/*'),
        this.destinationPath(path.join(pluginDest, 'variables')),
        this
      );
      this.fs.copyTpl(
        this.templatePath('pluginhandle/widgets/*'),
        this.destinationPath(path.join(pluginDest, 'widgets')),
        this
      );
    },
  },

  install: function () {
    var pluginDest = path.join(this.pluginDir, this.pluginHandleLower);
    var results = renamer.replace({
      regex: true,
      find: '^PluginHandle(.*)',
      replace: this.pluginHandle + '$1',
      files: renamer.expand(path.join(pluginDest, '**', '*')).files,
    });
    var generator = this;
    renamer.rename(results).list.forEach(function(file) {
      if (file.renamed) {
        generator.log(chalk.green('rename ') + file.before + ' => ' + file.after);
      }
    });

    if (this.useComposer) {
      require('child_process').exec('composer install --working-dir ' + pluginDest);
    }
  }
});
