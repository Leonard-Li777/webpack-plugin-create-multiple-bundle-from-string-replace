
[English](./README.md) | 简体中文

# webpack-plugin-create-multiple-bundle-from-string-replace

为了一次打包后布署多个环境，通过配置项，用字符串替换的方法从打包文件生成多个bundles

-- by 客如云前端团队 [keruyun.com](http://keruyun.com)
## 安装

```shell
npm i -D webpack-plugin-create-multiple-bundle-from-string-replace
```

## 用法

### 方法 1:
```javascript
const MultipleBundle = require('webpack-plugin-create-multiple-bundle-from-string-replace');

const config = {
  plugins: [
    new MultipleBundle({  // 必填参数
      targetOne: [
        ['HOST_API', 'HOST_CDN'], // find , 也支持正则 /HOST_API/
        ['//targetOne.you-company.com/api', '//targetOne.you-company.com/cdn'], // replace
      ],
      targetTwo: [
        ['HOST_API', 'HOST_CDN'],
        ['//targetTwo.you-company.com/api', '//targetTwo.you-company.com/cdn'],
      ],
    },
    { // 可选参数
      sourcePath: 'xxx/xxx', // 默认为空, 使用 webpack.config.output.path
      distPath: 'xxx/xxx', // 默认为空, 使用 webpack.config.output.path/multiple-bundle-from-string-replace
    }),
  ],
};
```

你将获得两个bundles目录(targetOne, targetTwo)里面所有文本文件都将被以上配置替换:

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
### 方法 2:
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

原始bundles目录(dist)里面所有文本文件都将被以上配置替换:

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
### 替换引擎

使用了第三方库 [replace-one](https://github.com/kodie/replace-once).

replaceOnce(fileContent, find, replace, 'g');

#### 工作方式

```javascript
var str = 'abc abcd a ab';
var find = ['abcd', 'abc', 'ab', 'a'];
var replace = ['a', 'ab', 'abc', 'abcd'];
replaceOnce(str, find, replace, 'g');
//=> 'ab a abcd abc'
```

感谢: https://github.com/kodie/replace-once

## License

MIT. See the [license.md file](license.md) for more info.
