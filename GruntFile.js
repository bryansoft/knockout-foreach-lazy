module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: true
            },
            package: {
                files: {
                    'pkg/knockout-foreach-lazy.min.js': ['src/knockout-foreach-lazy.js']
                }
            }
        },
        mocha_phantomjs: {
            all: ['test/**/*.html']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.registerTask('test', ['uglify:package','mocha_phantomjs'])
}
