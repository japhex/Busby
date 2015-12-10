// Generated on 2014-09-09 using generator-bones 0.0.4
'use strict';
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        assemble: {
            options: {
                flatten: true,
                layout: 'default.hbs',
                layoutdir: 'app/src/templates/layouts',
                partials: 'app/src/templates/partials/*.hbs',
                data: 'app/src/data/*.json'
            },
            pages: {
                files: {
                    'app/src/': ['app/src/templates/pages/*.hbs', 'app/src/templates/partials/*.hbs', '!app/src/templates/pages/index.hbs']
                }
            },
            index: {
                files: {
                    'app/src/': ['app/src/templates/pages/index.hbs']
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'app/src/',
                src: ['*.html'],
                dest: 'app/public/views'
            }
        },
        clean: {
          build: {
            src: ["app/public/views"]
          }
        }        
    });

    grunt.registerTask('assembleCopy', [
        'assemble',
        'clean',
        'copy:main'
    ]);

    grunt.registerTask('default', [
        'assemble'
    ]);
};
