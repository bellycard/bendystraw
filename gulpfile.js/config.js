process.env.NODE_ENV = 'development';

exports.paths = {
  src: 'source', // source folder for the app
  dest: 'build', // destination for the production build
  tmp: '.dev', // temporary development build folder
  env: 'env.json', // file for app specific config

  scripts: 'app', // folder where main javascript files are located
  styles: 'stylesheets', // stylesheets folder
  images: 'images', // image folder
  fonts: 'fonts', // fonts folder
  tests: 'tests' // folder for end to end tests
};

exports.settings = {
  module: 'templates', // angular module name for template cache
  port: '4567',  // port to run the server on
  images: [ // images to copy into project from bower_components
    'bower_components/rolodex/**/*'
  ],
  imagemin: { // options for image optimizer
    // verbose: true
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [ require('imagemin-pngquant')() ]
  },
  minifyHtml: { // options for html minification
    empty: true,
    spare: true,
    quotes: true,
    conditionals: true
  },
};

exports.extensions = {
  fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'], // font extensions
  images: ['jpg', 'jpeg', 'png', 'svg', 'gif'] // image extensions
};
