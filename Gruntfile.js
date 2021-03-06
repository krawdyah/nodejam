'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server.js'
      }
    },
    coffee: {
      compile: {
        files: {  
          'public/js/application.js': [
            'public/js/templates.js', 
            'public/coffee/nodejam.coffee',
            'public/coffee/helpers.coffee',
            'public/coffee/models.coffee',
            'public/coffee/views.coffee',
            'public/coffee/controllers.coffee',
            'public/coffee/routes.coffee' ]
        }
      }
    },
    uglify: {
      nodejam: {
        files: {
          'public/js/nodejam.min.js': ['public/js/application.js']
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      emberTemplates: {
        files: 'app/views/**/*.hbs',
        tasks: ['emberTemplates']
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      }
    },
    emberTemplates: {
      compile: {
        files: { 'public/js/nodejam/templates.js': ['app/views/templates/**/*.hbs'] },
        options: {
          templateFileExtensions: /\.hbs/,
          templateName: function(sourceFile) {
            return sourceFile.replace(/app\/views\/templates\//, '');
          }
        }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });
  
  grunt.registerTask('default', ['develop', 'watch', 'ember_templates']);
};
