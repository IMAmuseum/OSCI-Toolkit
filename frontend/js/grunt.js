/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      name: 'OSCI Toolkit',
      version: '0.1.0',
      author: 'The Art Institute of Chicago and the Indianapolis Museum of Art',
      banner: '/*\n' +
        ' * <%= meta.name %> - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * http://oscitoolkit.org/\n' +
        ' * Copyright (c) 2010-<%= grunt.template.today("yyyy") %> <%= meta.author %>\n' +
        ' * GNU General Public License\n' +
        ' */'
    },
    lint: {
      files: ['grunt.js', 'backbone/**/*.js', 'appBootstrap.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'backbone/**/*.js', '<file_strip_banner:appBootstrap.js>'],
        dest: 'dist/OSCI-Toolkit-<%= meta.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/OSCI-Toolkit-<%= meta.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'concat min'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
