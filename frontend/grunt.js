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
			files: ['grunt.js', 'js/backbone/**/*.js', 'js/appBootstrap.js']
		},
		concat: {
			dist: {
				src: [
					'<banner:meta.banner>',
					'js/backbone/helper.js',
					'js/backbone/Router.js',
					'js/backbone/TemplateManager.js',
					'js/backbone/collections/BaseCollection.js',
					'js/backbone/models/BaseModel.js',
					'js/backbone/views/BaseView.js',
					'js/backbone/templates/CompiledTemplates.js',
					'js/backbone/models/**/*.js',
					'js/backbone/collections/**/*.js',
					'js/backbone/views/PageView.js',
					'js/backbone/views/SectionView.js',
					'js/backbone/views/**/*.js',
					'js/appBootstrap.js'
				],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>.js'
			},
			dependencies: {
				src: ['js/external/json2.js', 'js/external/jquery-1.7.1.js', 'js/external/underscore-1.3.3.js', 'js/external/backbone.js'],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>-dependencies.js'
			},
			css: {
				src: [
					'<banner:meta.banner>',
					'css/common.css',
					'css/navigation.css',
					'css/search.css',
					'css/toolbar.css',
					'css/section.css',
					'css/multiColumnSection.css'
				],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>.css'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>.min.js'
			},
			dependencies: {
				src: ['<banner:meta.banner>', '<config:concat.dependencies.dest>'],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>-dependencies.min.js'
			}
		},
		cssmin: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.css.dest>'],
				dest: 'dist/OSCI-Toolkit-<%= meta.version %>.min.css'
			}
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'concat min'
		},
		precompileTemplates: {
			dist : {
				src: ['js/backbone/templates/*.tpl.html'],
				dest: 'js/backbone/templates/CompiledTemplates.js'
			}
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

	//MultiTask for Compiling Underscore templates into a single file
	grunt.registerMultiTask('precompileTemplates', 'Precompile Underscore templates', function() {
		var files = grunt.file.expandFiles(this.file.src);

		var src = grunt.helper('precompileTemplates', files);
		grunt.file.write(this.file.dest, src);

		if (this.errorCount) { return false; }

		grunt.log.writeln('File "' + this.file.dest + '" created.');
	});

	//Helper for compiligin Underscore templates
	grunt.registerHelper('precompileTemplates', function(files) {
		var output = '// OsciTk Namespace Initialization //\n' +
			'if (typeof OsciTk === "undefined"){OsciTk = {};}\n' +
			'if (typeof OsciTk.templates === "undefined"){OsciTk.templates = {};}\n' +
			'// OsciTk Namespace Initialization //\n';

		if (files) {
			output += files.map(function(filepath) {
				var templateHtml = grunt.task.directive(filepath, grunt.file.read),
					templateSrc = grunt.utils._.template(templateHtml).source,
					fileParts = filepath.split("\/"),
					fileName = fileParts[fileParts.length - 1];

				return "OsciTk.templates['" + fileName.substr(0,fileName.indexOf('.tpl.html')) + "'] = " + templateSrc;
			}).join('\n');
		}

		return output;
	});

	grunt.loadNpmTasks('/usr/local/lib/node_modules/grunt/node_modules/grunt-css');

	// Default task.
	grunt.registerTask('default', 'precompileTemplates concat min cssmin');

};