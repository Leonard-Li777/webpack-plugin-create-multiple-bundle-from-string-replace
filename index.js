const replaceOnce = require('replace-once');
const fs = require('fs-utils');
const join = require('path').join;

function ReplaceStringPatternPlugin(options = {}) {
  this.directReplace = false;
  if (options instanceof Array) {
    this.directReplace = true;
  }
  this.options = options;
}

function replaceContent(result, [patterns = [], replacement = []]) {
  if (typeof result === 'string') {
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
  return result;
}

function writeFile({ outPath, env, file, result }) {
  fs.writeFileSync(
    join(
      outPath,
      env ? `multiple-bundle-from-string-replace/${env}` : '',
      file,
    ),
    result,
  );
}

function replaceFile({ file, outPath, replacePattern }) {
  const fullFilePath = join(outPath, file);
  const fileContent = fs.readFileSync(fullFilePath);
  return replaceContent(fileContent, replacePattern);
}

ReplaceStringPatternPlugin.prototype.apply = function(compiler) {
  const { directReplace, options: replacePattern } = this;
  const outPath = compiler.options.output.path;
  const eventDone = (compilation, done) => {
    console.log(
      `[webpack-plugin-create-multiple-bundle-from-string-replace]: In ${outPath}`,
    );

    const files = fs.glob.sync('**/*', {
      cwd: outPath,
      nodir: true,
    });
    if (directReplace) {
      files.forEach(file => {
        const result = replaceFile({ file, outPath, replacePattern });
        writeFile({ outPath, file, result });
      });
      console.log('files are replaced!');
    } else {
      files.forEach(file => {
        for (const env in this.options) {
          const result = replaceFile({
            file,
            outPath,
            replacePattern: this.options[env],
          });
          writeFile({ outPath, env, file, result });
          console.log(join(`multiple-bundle-from-string-replace/${env} done!`));
        }
      });
    }

    done();
  };

  if (compiler.hooks) {
    const plugin = { name: 'createMultipleBundleFromStringReplacePlugin' };

    compiler.hooks.done.tapAsync(plugin, eventDone);
  } else {
    compiler.plugin('done', eventDone);
  }
};

module.exports = ReplaceStringPatternPlugin;
