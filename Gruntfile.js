/**
 * Created by Nasko on 4.7.2016 г..
 */
module.exports = function (grunt) {
    'use strict';

    var VERSION = '0.0.0'

    grunt.initConfig({
        typescript: {
            debug: {
                dest: 'bin/gamy.debug.js',
                src: ['src/**/*.ts'],
                options: {
                    target: 'ES5',
                    comments: true,
                    sourceMap: true,
                    declaration: false,
                    references: [
                        '../../projects/keesey-sha1-fcbee69dcc6f/bin/sha1.d.ts',
                        '../../projects/jquery/bin/jquery.d.ts'
                    ]
                }
            },
            release: {
                dest: 'bin/gamy.release.js',
                src: ['src/**/*.ts'],
                options: {
                    target: 'ES5',
                    comments: false,
                    sourceMap: false,
                    declaration: true,
                    references: [
                        '../../projects/keesey-sha1-fcbee69dcc6f/bin/sha1.d.ts',
                        '../../projects/jquery/bin/jquery.d.ts'
                    ]
                }
            }
        },
        uglify: {
            release: {
                options: {
                    sourceMap: false,
                    compress: {
                        global_defs: {
                            "DEBUG": false,
                            "VERSION": VERSION
                        }
                    }
                },
                files: {
                    'bin/gamy.release.min.js': ['bin/gamy.release.js']
                }
            },
            debug: {
                options: {
                    sourceMap: true,
                    sourceMapIn: 'bin/gamy.debug.js.map',
                    mangle: false,
                    compress: {
                        global_defs: {
                            "DEBUG": true,
                            "VERSION": VERSION
                        }
                    }
                },
                files: {
                    'bin/gamy.debug.min.js': ['bin/gamy.debug.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.registerTask('release', ['typescript:release', 'uglify:release']);
    grunt.registerTask('debug', ['typescript:debug', 'uglify:debug']);
};