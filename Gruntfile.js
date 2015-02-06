module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist/js/adcom*', 'dist/css/adcom*'],
      docs: ['docs/dist/js/adcom*', 'docs/dist/css/adcom*']
    },
    concat: {
      js: {
        src: [
          'js/object.js',
          'js/list.js',
          'js/form.js',
          'js/state.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'css/adcom.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      docsJs: {
        // NOTE: This src list is duplicated in footer.html; if making changes here, be sure to update the other copy too.
        src: [
          'docs/assets/js/vendor/holder.js',
          'docs/assets/js/vendor/underscore.min.js',
          'docs/assets/js/vendor/ZeroClipboard.min.js',
          'docs/assets/js/src/application.js'
        ],
        dest: 'docs/assets/js/docs.min.js'
      }
    },
    csslint: {
      options: {
        csslintrc: 'css/.csslintrc'
      },
      dist: [
        'dist/css/adcom.css'
      ],
      docs: {
        options: {
          ids: false,
          'overqualified-elements': false
        },
        src: 'docs/assets/css/src/docs.css'
      }
    },
    csscomb: {
      options: {
        config: 'css/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      },
      docs: {
        src: 'docs/assets/css/src/docs.css',
        dest: 'docs/assets/css/src/docs.css'
      }
    },
    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      docs: {
        src: [
          'docs/assets/css/src/docs.css',
          'docs/assets/css/src/pygments-manni.css'
        ],
        dest: 'docs/assets/css/docs.min.css'
      }
    },
    watch: {
      src: {
        files: 'js/*.js',
        tasks: ['dist-js', 'docs']
      }
    },
    copy: {
      docs: {
        src: 'dist/*/*',
        dest: 'docs/'
      },
      docs_license: {
        files: [
          { src: 'docs/LICENSE', dest: '_gh_pages/LICENSE-DOCS' },
          { src: 'docs/robots.txt', dest: '_gh_pages/robots.txt' },
          { src: 'LICENSE', dest: '_gh_pages/LICENSE' }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:js', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['concat:css', 'csscomb:dist', 'cssmin:minifyCore']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'dist-js', 'dist-css']);

  // Docs task.
  grunt.registerTask('docs-css', ['csscomb:docs', 'cssmin:docs']);
  grunt.registerTask('lint-docs-css', ['csslint:docs']);
  grunt.registerTask('docs-js', ['uglify:docsJs']);
  grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'clean:docs', 'copy:docs', 'copy:docs_license']);

  // Default task.
  grunt.registerTask('default', ['dist', 'docs']);
}
