module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    var appFiles = [
            'app/**/*.js'
        ],
        vendorFiles = [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js'
        ];

    grunt.initConfig({
        concat: {
            app: {
                src: appFiles,
                dest: 'out/app.js'
            },
            vendor: {
                src: vendorFiles,
                dest: 'out/vendor.js'
            }
        },

        less : {
            default: {
                src: ['app/styles/main.less'],
                dest: 'app/styles/main.css'
            }
        },

        connect: {
            server: {
                options: {
                    open: 'http://localhost:8181/test/',
                    hostname : '*',
                    port: '8181'
                }
            }
        }
    });


    grunt.task.registerTask('build',
        [
            'less',
            'concat'
        ]
    );
};