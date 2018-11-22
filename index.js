const replaceOnce = require('replace-once');
const fs = require('fs-utils');
const join = require('path').join;

function ReplaceStringPatternPlugin(options = {}, config = {}) {
  this.directReplace = false;
  if (options instanceof Array) {
    this.directReplace = true;
  }
  this.options = options;
  this.config = config;
}

function replaceContent(result, [patterns = [], replacement = []]) {
  if (
    Array.isArray(patterns) &&
    Array.isArray(replacement) &&
    patterns.length === replacement.length
  ) {
    return replaceOnce(result, patterns, replacement, 'g');
  } else {
    throw new Error(
      `[webpack-plugin-create-multiple-bundle-from-string-replace]:
        options patterns/replacement must be an array and them length are equal, got 
        patterns = ${patterns}
        replacement = ${replacement}
        `,
    );
  }
}

function writeFile({ distPath, env, file, result }) {
  fs.writeFileSync(join(distPath, env, file), result);
}

function replaceFile({ file, sourcePath, replacePattern }) {
  const fullFilePath = join(sourcePath, file);
  const fileContent = fs.readFileSync(fullFilePath);
  return replaceContent(fileContent, replacePattern);
}

function copyFile({ file, env = '', sourcePath, distPath }) {
  if (
    ['html', 'htm', 'css', 'js', 'jsx', 'json', 'md'].includes(
      path.extname(file).replace('.', ''),
    )
  ) {
    return true;
  }

  fs.copyFileSync(join(sourcePath, file), join(distPath, env, file));

  return false;
}

ReplaceStringPatternPlugin.prototype.apply = function(compiler) {
  const { directReplace, options: replacePattern, config } = this;
  const sourcePath = config.sourcePath || compiler.options.output.path;
  const distPath =
    config.distPath ||
    `${compiler.options.output.path}/multiple-bundle-from-string-replace`;

  const eventDone = (compilation, done) => {
    console.log(
      `[webpack-plugin-create-multiple-bundle-from-string-replace]: In ${distPath}`,
    );

    const files = fs.glob.sync('**/*', {
      cwd: sourcePath,
      nodir: true,
    });
    if (directReplace) {
      files.forEach(file => {
        if (copyFile({ file, sourcePath, distPath })) {
          const result = replaceFile({ file, sourcePath, replacePattern });
          writeFile({ distPath, file, result });
        }
      });
    } else {
      files.forEach(file => {
        for (const env in this.options) {
          if (copyFile({ file, sourcePath, distPath, env })) {
            const result = replaceFile({
              file,
              sourcePath,
              replacePattern: this.options[env],
            });
            writeFile({ distPath, env, file, result });
          }
        }
      });
    }
    console.log('files are replaced!');
    done && done();
  };

  if (compiler.hooks) {
    const plugin = { name: 'MultipleBundlePlugin' };

    compiler.hooks.done.tapAsync(plugin, eventDone);
  } else {
    compiler.plugin('done', eventDone);
  }
};

module.exports = ReplaceStringPatternPlugin;
