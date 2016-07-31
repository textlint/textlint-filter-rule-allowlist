// LICENSE : MIT
"use strict";
const execall = require('execall');
const escapeStringRegexp = require('escape-string-regexp');
const defaultOptions = {
    // white list
    // string or RegExp string
    // e.g.
    // "string"
    // "/\\d+/"
    allow: []
};
module.exports = function(context, options) {
    const {Syntax, shouldIgnore, getSource} = context;
    const allowWords = options.allow || defaultOptions.allow;
    const regExpWhiteList = allowWords.map(allowWord => {
        if (!allowWord) {
            return /^$/;
        }
        if (allowWord[0] === "/" && allowWord[allowWord.length - 1] === "/") {
            const regExpString = allowWord.slice(1, allowWord.length - 1);
            return new RegExp(regExpString, "g");
        }
        const escapeString = escapeStringRegexp(allowWord);
        return new RegExp(escapeString, "g");
    });
    return {
        [Syntax.Document](node){
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