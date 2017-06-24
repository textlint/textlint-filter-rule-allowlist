// LICENSE : MIT
"use strict";
const execall = require('execall');
const escapeStringRegexp = require('escape-string-regexp');
const toRegExp = require("str-to-regexp").toRegExp;
const COMPLEX_REGEX_END = /^.+\/(\w*)$/;
const defaultOptions = {
    // white list
    // string or RegExp string
    // e.g.
    // "string"
    // "/\\d+/"
    // "/^===/m"
    allow: []
};
module.exports = function(context, options) {
    const { Syntax, shouldIgnore, getSource } = context;
    const allowWords = options.allow || defaultOptions.allow;
    const regExpWhiteList = allowWords.map(allowWord => {
        if (!allowWord) {
            return /^$/;
        }
        if (allowWord[0] === "/" && COMPLEX_REGEX_END.test(allowWord)) {
            return toRegExp(allowWord);
        }
        const escapeString = escapeStringRegexp(allowWord);
        return new RegExp(escapeString, "g");
    });
    return {
        [Syntax.Document](node) {
            const text = getSource(node);
            regExpWhiteList.forEach(whiteRegExp => {
                const matches = execall(whiteRegExp, text);
                matches.forEach(match => {
                    const lastIndex = match.index + match.match.length;
                    shouldIgnore([match.index, lastIndex]);
                });
            });
        }
    };
};