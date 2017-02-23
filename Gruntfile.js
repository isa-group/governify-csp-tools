/*!
governify-csp-tools 0.0.1, built on: 2017-02-22
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-csp-tools

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-release-github');

    grunt.loadNpmTasks('grunt-banner');

    grunt.loadNpmTasks('grunt-dockerize');

    grunt.loadNpmTasks("grunt-ts");

    grunt.loadNpmTasks("grunt-tslint");

    // Project configuration.
    grunt.initConfig({
        //Load configurations
        pkg: grunt.file.readJSON('package.json'),
        licenseNotice: grunt.file.read('extra/license-notice', {
            encoding: 'utf8'
        }).toString(),
        latestReleaseNotes: grunt.file.read('extra/latest-release-notes', {
            encoding: 'utf8'
        }).toString(),

        //Add license notice and latest release notes
        usebanner: {
            license: {
                options: {
                    position: 'top',
                    banner: '/*!\n<%= licenseNotice %>*/\n',
                    replace: true
                },
                files: {
                    src: ['src/**/*.ts', 'tests/**/*.ts', 'Gruntfile.js', 'index.ts'] //If you want to inspect more file, you change this.
                }
            },
            readme: {
                options: {
                    position: 'bottom',
                    banner: '### Latest release\n\n<%= latestReleaseNotes %>',
                    replace: /##\sLatest\srelease(\s||.)+/g,
                    linebreak: false
                },
                files: {
                    src: ['README.md']
                }
            }
        },

        //Lint JS 
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'], //If you want to inspect more file, you change this.
            options: {
                jshintrc: '.jshintrc'
            }
        },

        //Execute mocha tests
        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'test.results<%= grunt.template.today("yyyy-mm-dd:HH:mm:ss") %>.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['tests/**/*.js']
            }
        },

        //Make a new release on github
        //"grunt release" for pacth version
        //"grunt release:minior" for minior version
        //"grunt release:major" for major version
        release: {
            options: {
                changelog: true, //NOT CHANGE
                changelogFromGithub: true, //NOT CHANGE
                githubReleaseBody: 'See [CHANGELOG.md](./CHANGELOG.md) for details.', //NOT CHANGE
                npm: false, //CHANGE TO TRUE IF YOUR PROJECT IS A NPM MODULE 
                //npmtag: true, //default: no tag
                beforeBump: [], // IS NOT READY YET
                afterBump: [], // IS NOT READY YET
                beforeRelease: [], // IS NOT READY YET
                afterRelease: [], // IS NOT READY YET
                updateVars: ['pkg'], //NOT CHANGE
                github: {
                    repo: "isa-group/project-template-nodejs",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    usernameVar: "GITHUB_USERNAME" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                }
            }
        },

        //IT IS RECOMENDED TO EXECUTE "grunt watch" while you are working.
        watch: {
            scripts: {
                files: ['src/**/*.ts', 'index.ts'],
                tasks: ['ts', 'tslint']
            }
        },

        //USE THIS TASK FOR BUILDING AND PUSHING docker images
        dockerize: {
            'project-template-latest': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        username: "DOCKER_HUB_USERNAME", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        password: "DOCKER_HUB_PASSWORD" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    },
                    name: 'project-template',
                    push: true
                }
            },
            'project-template-version': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        username: "DOCKER_HUB_USERNAME", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        password: "DOCKER_HUB_PASSWORD" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    },
                    name: 'project-template',
                    tag: '<%= pkg.version %>',
                    push: true
                }
            }
        },

        // Transpile TypeScript files to JavaScript
        ts: {
            app: {
                files: [{
                    src: [
                        "src/**/*.ts", 'index.ts'
                    ]
                }],
                options: {
                    module: "commonjs",
                    target: "es5",
                    noImplicitAny: false,
                    sourceMap: false,
                    noLib: false,
                    "no-string-literal": false
                }
            }
        },

        // TypeScript lint
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: ["src/**/*.ts"]
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'usebanner']);

    //TEST TASK
    grunt.registerTask('test', ['jshint', 'mochaTest']);

    //BUILD TASK
    grunt.registerTask('build', ['test', 'usebanner', 'dockerize']);

    //DEVELOPMENT TASK
    grunt.registerTask('dev', ['usebanner', 'watch']);

};