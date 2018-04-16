## Install

``` bash
npm install dev-hook-utils
```

安装完成之后，推荐使用`git commit`命令行提交，这样可以比较方便的编辑commit message.

[![asciicast](https://asciinema.org/a/OSm2ucL6pFHJd1OX254AlgOVN.png)](https://asciinema.org/a/OSm2ucL6pFHJd1OX254AlgOVN)

## How it works
1. `pre-commit`钩子中执行eslint
1. `prepare-commit-msg`钩子中执行commitizen提供编辑commit message的快捷菜单
1. `commit-msg`钩子中执行commitlint对commit message进行验证

## 优点
1. 不会在ci环境中执行
1. 会兼容已有的钩子
1. eslint配置可以自定义

## Configs
1. commitizen 提交时的选项

    待开放

1. commitlint 验证提交消息的格式

    待开放

1. eslint 代码检查

    直接使用.eslintrc.*文件配置规则。直接
    ``` js
    {
      // 直接基于hooks中的规则做校验
      extends: [require.resolve('dev-hook-utils/dist/hooks/eslintrc.js')]
    }
    ```

1. hook 自定义钩子

    待开放
