const path = require("path");
const { rcFile } = require("rc-config-loader");
const { getConfigBaseDir } = require("@textlint/get-config-base-dir");
const { matchPatterns } = require("@textlint/regexp-string-matcher");
const getAllowWordsFromFiles = (files, baseDirectory) => {
    let results = [];
    files.forEach((filePath) => {
        // TODO: use other loader
        const contents = rcFile("file", {
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

const defaultOptions = {
    /**
     * allowing list strings or RegExp-like strings
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
    allowlistConfigPaths: []
};
module.exports = function(context, options) {
    const { Syntax, shouldIgnore, getSource } = context;
    const baseDirectory = getConfigBaseDir(context) || process.cwd();
    const allowWords = options.allow || defaultOptions.allow;
    const allowlistConfigPaths = options.allowlistConfigPaths
        ? getAllowWordsFromFiles(options.allowlistConfigPaths, baseDirectory)
        : [];
    const allAllowWords = allowWords.concat(allowlistConfigPaths);
    return {
        [Syntax.Document](node) {
            const text = getSource(node);
            const matchResults = matchPatterns(text, allAllowWords);
            matchResults.forEach((result) => {
                shouldIgnore([result.startIndex, result.endIndex]);
            });
        }
    };
};
