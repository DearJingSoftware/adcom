module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist/js/adcom*', 'dist/css/adcom*'],
      docs: ['docs/dist/js/adcom*', 'docs/dist/css/adcom*']
    },
    concat: {
      adcom: {
        src: [
          'js/index.js',
          'js/form.js',
          'js/state.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.adcom.dest %>',
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
    less: {
      compileCore: {
        options: {
          sourceMap: true,
          outputMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/adcom.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },
    copy: {
      docs: {
        src: 'dist/*/*',
        dest: 'docs/'
      },
      docs_license: {
        files: [
          { src: 'LICENSE', dest: '_gh_pages/LICENSE' },
          { src: 'docs/LICENSE', dest: '_gh_pages/LICENSE-DOCS' }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileCore']);
  grunt.registerTask('dist-css', ['less-compile']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-js', 'dist-css']);

  // Docs task.
  grunt.registerTask('docs-js', ['uglify:docsJs']);
  grunt.registerTask('docs', ['docs-js', 'clean:docs', 'copy:docs', 'copy:docs_license']);

  // Default task.
  grunt.registerTask('default', ['dist', 'docs']);
}
