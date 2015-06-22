/**
 *
 */
module.exports = function (grunt) {
	grunt.initConfig({
        requirejs: {
          compile: {
            options: {
              baseUrl: 'app',
              mainConfigFile: 'app/application.js',
              name: 'application',
              out: 'app/dist/application.js',
              optimize: 'none'
            }
          }
        }
	});

	//
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	//
	grunt.registerTask('build', ['requirejs']);
};