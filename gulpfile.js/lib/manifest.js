


// Getters for various aspects of the manifest (package.json)
exports.manifest = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

exports.version = function() {
  return 'v' + exports.manifest().version
}

function repo() {
  var manifest = exports.manifest();
  var repo = manifest.repository && /git@github\.com:([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  if (!repo) repo = /git\:\/\/github\.com\/([\w-]+)\/([\w-]+)\.git/.exec(manifest.repository.url);
  return repo;
}

exports.owner = function() {
  return repo()[1];
};

exports.repo = function() {
  return repo()[2];
};
