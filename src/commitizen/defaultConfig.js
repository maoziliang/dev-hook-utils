module.exports = {
  types: [
    {value: 'feat',     name: 'feat:     一个功能特性'},
    {value: 'fix',      name: 'fix:      修复一个bug'},
    {value: 'docs',     name: 'docs:     只更改了文档'},
    {value: 'style',    name: 'style:    修改了代码的风格(例如空格, 格式, 缺失的分号等等，注意不是修改了css样式)'},
    {value: 'refactor', name: 'refactor: 重构代码，既没有修复bug也没有增加新功能特性'},
    {value: 'perf',     name: 'perf:     提升了代码性能'},
    {value: 'test',     name: 'test:     增加了缺失的测试用例'},
    {value: 'build',    name: 'build:    修改了构建相关代码'},
    {value: 'chore',    name: 'chore:    修改了其他辅助工具相关代码，例如生成文档的工具'},
    {value: 'wip',      name: 'wip:      Work In Process，未完成品'},
    {value: 'revert',   name: 'revert:   重置了一个提交'},
  ],

  scopes: [],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages
  messages: {
    type: '请选择这次变更的type:',
    scope: '\n选择这次变更的SCOPE(optional):',
    // used if allowCustomScopes is true
    customScope: '填写这次变更的scope(例如: 订单中心、用户中心、编辑商品页):',
    subject: '填写主题: 使用一个简短祈使句描述本次变更100字内(例如: 新增了xxx功能的接口):\n',
    body: '填写正文: 对本次提交更详细的描述。使用"|"来分行(optional):\n',
    // breaking: '列出重大更改(optional):\n',
    // footer: '列出任何被这个提交关闭的ISSUES(optional). 例如: #31, #34:\n',
    confirmCommit: '确定要提交吗?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: false,
  appendBranchNameToCommitMessage: false,
  allowFooter: false,
};