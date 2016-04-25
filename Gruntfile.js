module.exports = function(grunt) {

  grunt.initConfig({
    shell: {
      unit_test_coverage_report: {
        command: [
          'rm -rf static/lcov-report',
          'mkdir static/lcov-report',
          'node_modules/mocha/bin/mocha  --recursive --require blanket -R json-cov > coverage.json test/unit-tests/ test/unit-tests/',
          'node_modules/mocha/bin/mocha  --recursive --require blanket -R html-cov > static/lcov-report/index.html test/unit-tests/'
        ].join(';')
      },
      unit_test_coverage_report_html: {
        command: [
          'rm -rf static/lcov-report',
          'mkdir static/lcov-report',
          'node_modules/mocha/bin/mocha  --recursive --require blanket -R html-cov > static/lcov-report/index.html test/unit-tests/ node_modules/mind1-auth/test/lib'
        ].join(';')
      },
      unit_test_coverage_report_json: {
        command: [
          'node_modules/mocha/bin/mocha  --recursive --require blanket -R json-cov > coverage.json test/unit-tests/ test/unit-tests/',
        ].join(';')
      }
    },
    mochaTest: {
      unit_test: {
        options: {
          reporter: 'spec',
          timeout: 2000,
          quiet: false,
          clearRequireCache: false
        },
        src: [
          'test/unit-tests/*/test-*.js'
        ]
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: [{
          'client/assets/dist/dharti.min.css': [
            'client/assets/css/materialize.min.css',
            'client/assets/css/style.css'
          ]
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> \n*/\n',
        sourceMap: true,
        mangle: false,
        beautify: true,
        compress: {
          //drop_console: true
          global_defs: {
            "DEBUG": false
          },
          //dead_code: true
        },
        sourceMapName: 'sourceMap.map'
      },
      lib: {
        files: [{
          'client/assets/dist/js/lib.min.js': 'client/assets/js/*.js'
        }]
      },
      vendor: {
        files: [{
          'client/assets/dist/js/vendor.min.js': [
            'client/bower_components/jquery/dist/jquery.min.js',
            'client/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/ngstorage/ngStorage.min.js',
            'client/bower_components/underscore/underscore.js',
            'client/bower_components/momentjs/min/moment.min.js',

            'client/bower_components/angular-animate/angular-animate.min.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'client/bower_components/angular-material/angular-material.js',
            'client/bower_components/underscore/underscore-min.js'
          ]
        }]
      },
      dharti: {
        files: [{
          'client/assets/dist/js/crossover.min.js': [
            'client/init.js',
            'client/crossover.js',
            'client/routes/main.js',
            'client/services/interceptor.js',
            'client/services/main.js',
            'client/directives/*.js',
            'client/controllers/*.js',

            'client/packages/utilities/utilities.js',
            'client/packages/utilities/settings.js',
            'client/packages/utilities/services/*.js',

            'client/packages/dashboard/*.js',
            'client/packages/dashboard/controllers/*.js',
            'client/packages/dashboard/routes/*.js',
            'client/packages/dashboard/services/*.js',
            'client/packages/dashboard/directives/*.js',
          ]
        }]
      }
    },
    watch: {
      options: {
        livereload: false,
      },
      css: {
        files: ['client/assets/css/*.css'],
        tasks: ['cssmin'],
      },
      lib: {
        files: ['client/assets/js/*.js'],
        tasks: ['uglify:lib'],
      },
      dhartiJs: {
        files: ['client/init.js',
          'client/crossover.js',
          'client/routes/main.js',
          'client/services/interceptor.js',
          'client/services/main.js',
          'client/directives/*.js',
          'client/controllers/*.js',

          'client/packages/utilities/utilities.js',
          'client/packages/utilities/settings.js',
          'client/packages/utilities/services/*.js',

          'client/packages/dashboard/*.js',
          'client/packages/dashboard/controllers/*.js',
          'client/packages/dashboard/routes/*.js',
          'client/packages/dashboard/services/*.js',
          'client/packages/dashboard/directives/*.js',

        ],
        tasks: ['uglify:dharti'],
        options: {
          // Start another live reload server on port 1337
          livereload: 1337,
        },
      },
    },
    jslint: {
      // lint the server code
      server: {
        // files to lint
        src: [
          'app.js',
          'server/controllers/*.js',
          'server/routes/*.js',
          'server/utils/*.js'
        ],
        // files to exclude
        exclude: [
          'server/config.js'
        ],
        // lint options
        directives: {
          // node environment
          node: true,
          // browser environment
          browser: false,
          // allow dangling underscores
          nomen: true,
          // allow todo statements
          todo: true,
          // allow unused parameters
          unparam: true,
          // don't require strcit pragma
          sloppy: true,
          // allow whitespace discrepencies
          white: true
        }
      },
      // lint the client code
      client: {
        src: [
          'client/*.js'
        ],
        directives: {
          // node environment
          node: false,
          // browser environment
          browser: true,
          // allow dangling underscores
          nomen: true,
          // allow todo statements
          todo: true,
          // allow unused parameters
          unparam: true,
          // add predefined libraries
          predef: [
            '$',
            '_',
            'Handlebars',
            'Backbone',
          ]
        },
      }
    }
  });

  // Grunt Modules
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('less-plugin-autoprefix');
  grunt.loadNpmTasks('less-plugin-clean-css');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jslint');

  // Code coverage tasks
  // All reports
  grunt.registerTask('unit_test_coverage_report', [
    'shell:unit_test_coverage_report'
  ]);
  // HTML reports
  grunt.registerTask('html_report', [
    'shell:unit_test_coverage_report_html'
  ]);
  // JSON reports
  grunt.registerTask('json_report', [
    'shell:unit_test_coverage_report_json'
  ]);
  // Run all tests
  grunt.registerTask('test', ['mochaTest:unit_test']);

  grunt.registerTask('lint', 'Run linting', ['jslint']);
  grunt.registerTask('default', ['cssmin', 'uglify']);
  grunt.registerTask('production', ['cssmin', 'uglify']);
};
