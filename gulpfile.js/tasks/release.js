'use strict';

var util = require('../util');
var changelog = require('../lib/changelog');
var bump = require('../lib/bump');

var gulp = require('gulp');
var gutil = require('gulp-util');
var githubRelease = require('gulp-github-release');
var runSequence = require('run-sequence');
var git = require('gulp-git');
var path = require('path');
var zip = require('gulp-zip');

// Refactor this.. global for changelog task, used later
// when tagging/releasing.
var allCommits = {};

// Prints out and stores the commits since the previous release
gulp.task('changelog', function(callback) {
  changelog(false, function(commits) {
    if (commits && commits.raw) {
      util.log(gutil.colors.yellow('Commits since last release:'));

      commits.raw.split('\n').forEach(function(commit) {
        if(commit === '') return;
        util.log('  ' + commit);
      });

      allCommits = commits;
    }

    callback();
  });
});

// Bumps the version number
gulp.task('bump', function(callback) {
  bump(callback);
});

// Fetches tags
gulp.task('fetch', function(callback) {
  git.fetch('origin', '', {quiet: true}, callback);
});

// Commits the manifest with the bumped version number
gulp.task('commit', function(callback) {
  util.log(gutil.colors.yellow('Committing version bump to ' + util.version()));

  return gulp.src('./package.json')
    .pipe(git.add({quiet: true}))
    .pipe(git.commit('[RELEASE] ' + util.version(), {quiet: true}));
});

// Pushes the commit for the version bump
gulp.task('push', function (callback) {
  util.log(gutil.colors.yellow('Pushing version bump to ' + util.version()));

  git.push('origin', 'master', callback);
});

// Takes the zip'd up build folder and posts it to a GitHub release
// with a changelog generated in the earlier task.
gulp.task('github-release', function(callback) {
  util.log(gutil.colors.yellow('Tag and releasing version ' + util.version() + ' to GitHub'));

  var date = new Date().toJSON().slice(0,10);
  var message = date + ' Release\n' + (allCommits.markdown || '');

  return gulp.src(path.join(config.paths.dest, 'build.zip'))
    .pipe(githubRelease({
      token: process.env.GITHUB_TOKEN,
      notes: message,
      manifest: util.manifest(),
    }, function(err, release) {
      util.errorHandler('github-release')(err);
    }))
    .on('error', util.errorHandler('publish-release'))
});

function release(callback) {
  if (process.env.GITHUB_TOKEN === '' ||
      process.env.GITHUB_TOKEN === undefined) {
    util.errorHandler('deploy')(new Error('Missing GITHUB_TOKEN environment variable'));
    return false;
  }

  if (!util.fileExists('build/build.zip')) {
    util.errorHandler('deploy')(new Error('You need to build the application first. Run `gulp build`'));
    return;
  }

  runSequence(
    'changelog',
    'bump',
    'commit',
    'push',
    'github-release',
    'fetch',
    function (error) {
      if (error) {
        util.errorHandler('release')(error);
      } else {
        util.log('🍺  ' + gutil.colors.yellow('Release complete!'));
      }
      callback(error);
    });
}

gulp.task('release', release);

module.exports = release;