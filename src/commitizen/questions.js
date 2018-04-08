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
import buildCommit from './buildCommit';

function isNotWip (answers) {
  return answers.type.toLowerCase() !== 'wip';
};

export default function getQuestions(config, cz) {
  const scopeOverrides = config.scopeOverrides || {};
  const messages = config.messages || {};

  messages.type = messages.type || 'Select the type of change that you\'re committing:';
  messages.scope = messages.scope || '\nDenote the SCOPE of this change (optional):';
  messages.customScope = messages.customScope || 'Denote the SCOPE of this change:';
  messages.subject = messages.subject || 'Write a SHORT, IMPERATIVE tense description of the change:\n';
  messages.body = messages.body || 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n';
  messages.breaking = messages.breaking || 'List any BREAKING CHANGES (optional):\n';
  messages.footer = messages.footer || 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n';
  messages.confirmCommit = messages.confirmCommit || 'Are you sure you want to proceed with the commit above?';

  const questions = [
    {
      type: 'list',
      name: 'type',
      message: messages.type,
      choices: config.types
    },
    {
      type: 'list',
      name: 'scope',
      message: messages.scope,
      choices: function(answers) {
        let scopes = [];
        if (scopeOverrides[answers.type]) {
          scopes = scopes.concat(scopeOverrides[answers.type]);
        } else {
          scopes = scopes.concat(config.scopes);
        }
        if (config.allowCustomScopes || scopes.length === 0) {
          scopes = scopes.concat([
            new cz.Separator(),
            { name: 'empty', value: false },
            { name: 'custom', value: 'custom' }
          ]);
        }
        return scopes;
      },
      when: function(answers) {
        let hasScope = false;
        if (scopeOverrides[answers.type]) {
          hasScope = !!(scopeOverrides[answers.type].length > 0);
        } else {
          hasScope = !!(config.scopes && (config.scopes.length > 0));
        }
        if (!hasScope) {
          answers.scope = 'custom';
          return false;
        } else {
          return isNotWip(answers);
        }
      }
    },
    {
      type: 'input',
      name: 'scope',
      message: messages.customScope,
      when: function(answers) {
        return answers.scope === 'custom';
      }
    },
    {
      type: 'input',
      name: 'subject',
      message: messages.subject,
      validate: function(value) {
        return !!value;
      },
      filter: function(value) {
        return value.charAt(0).toLowerCase() + value.slice(1);
      }
    },
    {
      type: 'input',
      name: 'body',
      message: messages.body
    },
    {
      type: 'input',
      name: 'breaking',
      message: messages.breaking,
      when: function(answers) {
        if (config.allowBreakingChanges && config.allowBreakingChanges.indexOf(answers.type.toLowerCase()) >= 0) {
          return true;
        }
        return false; // no breaking changes allowed unless specifed
      }
    },
    {
      type: 'input',
      name: 'footer',
      message: messages.footer,
      when: function (answers) {
        return config.allowFooter && isNotWip(answers);
      },
    },
    {
      type: 'expand',
      name: 'confirmCommit',
      choices: [
        { key: 'y', name: 'Yes', value: 'yes' },
        { key: 'n', name: 'Abort commit', value: 'no' },
      ],
      default: 0,
      message: function(answers) {
        const SEP = '###--------------------------------------------------------###';
        console.log('\n' + SEP + '\n' + buildCommit(answers, config) + '\n' + SEP + '\n');
        return messages.confirmCommit;
      }
    }
  ];

  return questions;
}