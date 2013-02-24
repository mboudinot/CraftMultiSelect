module.exports = function(grunt) {

    grunt.initConfig({
        meta : {
            banner : "/*!\n CraftMultiSelect.js" +
                "\n 0.0.1 \n*/"
        },
        concat: {
            dist: {
                src: ['<banner>','src/multi.js'],
                dest: 'CraftMultiSelect.js',
                separator : '\n'
            },
            sample: {
                src: ['lib/craft.js','<banner>','src/multi.js'],
                dest: 'sample/public/CraftMultiSelect-standalone.js',
                separator : '\n'
            }
        },
        min: {
            "CraftMultiSelect-min.js": [ "<banner>", "CraftMultiSelect.js" ]
        },
        lint: {
            afterconcat: ['<config:concat.dist.dest>']
        },
        jshint: {
            options: {
                asi: true,
                laxcomma: true,
                bitwise: false,
                eqeqeq: false,
                boss: true,
                evil: true,
                browser: true
            }
        },
        jade: {
            compile: {
                options: {
                    pretty:true,
                    data: {
                        debug: false
                    }
                },
                files: {
                    "index.html": ["index.jade"]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.registerTask('default', 'concat lint min jade');
    grunt.registerTask('sample', 'concat concat:sample lint min');
};