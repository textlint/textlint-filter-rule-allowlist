// LICENSE : MIT
"use strict";
const path = require("path");
const execall = require("execall");
const escapeStringRegexp = require("escape-string-regexp");
const toRegExp = require("str-to-regexp").toRegExp;
const rcfile = require("rc-config-loader");
const { getConfigBaseDir } = require("@textlint/get-config-base-dir");
const getAllowWordsFromFiles = (files, baseDirectory) => {
    let results = [];
    files.forEach(filePath => {
        // TODO: use other loader
        const contents = rcfile("file", {
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
     * White list strings or RegExp strings
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
     * file path list that includes allow words.
     */
    whitelistConfigPaths: []
};
module.exports = function(context, options) {
    const { Syntax, shouldIgnore, getSource } = context;
    const baseDirectory = getConfigBaseDir(context) || process.cwd();
    const allowWords = options.allow || defaultOptions.allow;
    const whitelistConfigPaths = options.whitelistConfigPaths
        ? getAllowWordsFromFiles(options.whitelistConfigPaths, baseDirectory)
        : [];
    const allAllowWords = allowWords.concat(whitelistConfigPaths);
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
