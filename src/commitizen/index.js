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
import inquirer from 'inquirer';
import fse from 'fs-extra';

const defaultConfig = require('./defaultConfig');
import getQuestions from './questions.js';
import buildCommit from './buildCommit';

function commit(editMsgFile, message) {
  const rawMsgContent = fse.readFileSync(editMsgFile);
  fse.writeFileSync(editMsgFile, `${message} ${rawMsgContent}`, { encoding: 'utf-8' });
}

export default function prompt(editMsgFile) {
  const config = defaultConfig;

  console.log('\n\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

  const questions = getQuestions(config, inquirer);

  inquirer.prompt(questions).then(function(answers) {
    console.log(answers.confirmCommit);
    try {
      if (answers.confirmCommit === 'yes') {
        commit(editMsgFile, buildCommit(answers, config));
      } else {
        console.log('Commit has been canceled.');
      }
    } catch (e) {
      console.error(e, e.stack);
      process.exit(3);
    }
  });
}
