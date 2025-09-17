const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour améliorer le source mapping et éviter les erreurs ENOENT
config.resolver.sourceExts.push('jsx', 'tsx');
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

// Améliorer la gestion des source maps
config.symbolicator = {
  customizeFrame: (frame) => {
    const collapse = Boolean(
      frame.file && (
        frame.file.includes('node_modules') ||
        frame.file.includes('metro-runtime') ||
        frame.file === '<anonymous>'
      )
    );
    return { ...frame, collapse };
  },
};

module.exports = config;