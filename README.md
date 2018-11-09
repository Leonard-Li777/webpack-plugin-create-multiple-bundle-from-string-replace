English | [简体中文](./README_zh-CN.md)

# webpack-plugin-create-multiple-bundle-from-string-replace

Create some bundles for multi-target environment which from string replace options

-- by [keruyun.com](http://keruyun.com)
## Installation

```shell
npm i -D webpack-plugin-create-multiple-bundle-from-string-replace
```

## Usage

### Example 1:
```javascript
const MultipleBundle = require('webpack-plugin-create-multiple-bundle-from-string-replace');

const config = {
  plugins: [
    new MultipleBundle({ // require
      targetOne: [
        ['HOST_API', 'HOST_CDN'], // find , may contain Regular Expressions, /HOST_API/
        ['//targetOne.you-company.com/api', '//targetOne.you-company.com/cdn'], // replace
      ],
      targetTwo: [
        ['HOST_API', 'HOST_CDN'],
        ['//targetTwo.you-company.com/api', '//targetTwo.you-company.com/cdn'],
      ],
    },
    { // optional
      sourcePath: 'xxx/xxx', // default is undefined then used webpack.config.output.path
      distPath: 'xxx/xxx',  // default is undefined then used webpack.config.output.path/multiple-bundle-from-string-replace
    }),
  ],
};
```

Then get two bundles directory (targetOne, targetTwo) in which all text type of files are replaced by above options:

```shell
${webpack.config.output.path}/multiple-bundle-from-string-replace/(targetOne|targetTwo)
```

```shell
dist
├── ...originOutput
│
└── multiple-bundle-from-string-replace
    ├── targetOne
    │   ├── ...replacedOutput
    │   └── ...replacedOutput
    └── targetTwo
        ├── ...replacedOutput
        └── ...replacedOutput
```
### Example 2:
```javascript
const MultipleBundle = require('webpack-plugin-create-multiple-bundle-from-string-replace');

const config = {
  plugins: [
    new MultipleBundle([
        ['HOST_API', 'HOST_CDN'], // find , may contain Regular Expressions, /HOST_API/
        ['//targetOne.you-company.com/api', '//targetOne.you-company.com/cdn'], // replace
      ]),
  ],
};
```

Then get origin bundles directory which all text type of files are replaced by above options:

```shell
${webpack.config.output.path}/
```

```shell
dist
└── ...replacedOutput
```
```javascript
'HOST_API' => '//targetOne.you-company.com/api'
'HOST_CDN' => '//targetOne.you-company.com/cdn'
```
### Replace Engine

Used [replace-one](https://github.com/kodie/replace-once).

replaceOnce(fileContent, find, replace, 'g');

#### Parameters

```javascript
var str = 'abc abcd a ab';
var find = ['abcd', 'abc', 'ab', 'a'];
var replace = ['a', 'ab', 'abc', 'abcd'];
replaceOnce(str, find, replace, 'g');
//=> 'ab a abcd abc'
```

thanks: https://github.com/kodie/replace-once

## License

MIT. See the [license.md file](license.md) for more info.
