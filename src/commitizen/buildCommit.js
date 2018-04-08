/*
The MIT License (MIT)

Copyright (c) 2016 Leonardo Correa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import wrap from 'word-wrap';

export default function buildCommit(answers, config) {

  const maxLineWidth = 100;

  const wrapOptions = {
    trim: true,
    newline: '\n',
    indent:'',
    width: maxLineWidth
  };

  function addScope(scope) {
    if (!scope) return ': '; //it could be type === WIP. So there is no scope

    return '(' + scope.trim() + '): ';
  }

  function addSubject(subject) {
    return subject.trim();
  }

  function escapeSpecialChars(result) {
    const specialChars = ['\`'];

    specialChars.map(function (item) {
      // For some strange reason, we have to pass additional '\' slash to commitizen. Total slashes are 4.
      // If user types "feat: `string`", the commit preview should show "feat: `\\string\\`".
      // Don't worry. The git log will be "feat: `string`"
      result = result.replace(new RegExp(item, 'g'), '\\\\`');
    });
    return result;
  }

  // Hard limit this line
  const head = (answers.type + addScope(answers.scope) + addSubject(answers.subject)).slice(0, maxLineWidth);

  // Wrap these lines at 100 characters
  let body = wrap(answers.body, wrapOptions) || '';
  body = body.split('|').join('\n');

  const breaking = wrap(answers.breaking, wrapOptions);
  const footer = wrap(answers.footer, wrapOptions);

  let result = head;
  if (body) {
    result += '\n\n' + body;
  }
  if (breaking) {
    const breakingPrefix = config && config.breakingPrefix ? config.breakingPrefix : 'BREAKING CHANGE:';
    result += '\n\n' + breakingPrefix + '\n' + breaking;
  }
  if (footer) {
    const footerPrefix = config && config.footerPrefix ? config.footerPrefix : 'ISSUES CLOSED:';
    result += '\n\n' + footerPrefix + ' ' + footer;
  }

  return escapeSpecialChars(result);
};