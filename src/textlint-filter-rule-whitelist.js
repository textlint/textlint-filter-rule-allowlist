// LICENSE : MIT
"use strict";
const path = require('path');
const execall = require('execall');
const escapeStringRegexp = require('escape-string-regexp');
const toRegExp = require("str-to-regexp").toRegExp;
const rcfile = require("rc-config-loader");

const getAllowWordsFromFiles = (files, baseDirectory) => {
    let results = [];
    files.forEach(filePath => {
        // TODO: use other loader
        const contents = rcfile("file", {
            // This is not json
            configFileName: path.resolve(baseDirectory, filePath)
        });
        if (contents && Array.isArray(contents.config)) {
            results = results.concat(contents.config);
        } else {
            throw new Error(`This allow file is not allow word list: ${filePath}`);
        }
    });
    return results;
};

const COMPLEX_REGEX_END = /^.+\/(\w*)$/;
const defaultOptions = {
    /**
     * white list strings or RegExp strings
     * For example, you can specify following.
     *
     * [
     *     "string",
     *     "/\\d+/",
     *     "/^===/m",
     * ]
     */
    allow: [],
    /**
     * white list file paths
     */
    allowPaths: []
};
module.exports = function(context, options) {
    const { Syntax, shouldIgnore, getSource } = context;
    const baseDirectory = context.getConfigBaseDir();
    const allowWords = options.allow || defaultOptions.allow;
    const allowFileContents = options.allowPaths
        ? getAllowWordsFromFiles(options.allowPaths, baseDirectory)
        : [];
    const allAllowWords = allowWords.concat(allowFileContents);
    const regExpWhiteList = allAllowWords.map(allowWord => {
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
