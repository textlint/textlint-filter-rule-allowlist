import path from "path";
import yaml from "js-yaml";
import { getConfigBaseDir } from "@textlint/get-config-base-dir";
import { matchPatterns } from "@textlint/regexp-string-matcher";

const loadAllowlistConfigFile = (baseDirectory, filePath) => {
    // It is for suppoting browser bundler.
    const fs = require("fs");
    const configFilePath = path.resolve(baseDirectory, filePath);
    const extName = path.extname(configFilePath);
    const configFile = fs.readFileSync(configFilePath);
    if (extName == ".json") {
        return JSON.parse(configFile);
    } else if (/\.(yml|yaml)$/.test(extName)) {
        return yaml.load(configFile);
    }
    throw new Error(`Unsupported file type: ${filePath}`);
};

const getAllowWordsFromFiles = (files, baseDirectory) => {
    let results = [];
    files.forEach((filePath) => {
        const config = loadAllowlistConfigFile(baseDirectory, filePath);
        if (config && Array.isArray(config)) {
            results = results.concat(config);
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
export default function (context, options) {
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
}
