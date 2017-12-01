// LICENSE : MIT
"use strict";
const path = require("path");
const TextLintCore = require("textlint").TextLintCore;
const TextLintNodeType = require("textlint").TextLintNodeType;
import filterRule from "../src/textlint-filter-rule-whitelist";
import reportRule from "textlint-rule-report-node-types";

const assert = require("power-assert");
describe("textlint-rule-filter-whitelist", function() {
    context("when whitelistConfigPaths", function() {
        it("should read json and use it as allow words", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Str]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    whitelistConfigPaths: [path.join(__dirname, "fixtures/allow.json")]
                }
            });
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
        it("should read yml and use it as allow words", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Str]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    whitelistConfigPaths: [path.join(__dirname, "fixtures/allow.yml")]
                }
            });
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        })
    });
    context("when report and filter type", function() {
        it("should messages is empty", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Str]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    allow: ["text"]
                }
            });
            return textlint.lintText("text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is not ignored", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Code]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    // not regExp
                    allow: ["`\\d\+`"]
                }
            });
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 1);
            });
        });
        it("should messages is ignore by RegExp", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Code]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    allow: ["/`\\d+`/"]
                }
            });
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is ignore by RegExp + flag", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Paragraph]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    allow: [
                        "/^={1,4}\\s/m",
                        "This is not error."
                    ]
                }
            });
            return textlint.lintMarkdown("This is error.=== Title").then(({ messages }) => {
                assert.equal(messages.length, 1);
            }).then(() => {
                return textlint.lintMarkdown("This is not error.\n\n=== Title").then(({ messages }) => {
                    assert.equal(messages.length, 0);
                });
            })
        });
        it("should messages is ignore by RegExp", function() {
            const textlint = new TextLintCore();
            textlint.setupRules({
                report: reportRule
            }, {
                report: {
                    nodeTypes: [TextLintNodeType.Str]
                }
            });
            textlint.setupFilterRules({
                whitelist: filterRule
            }, {
                whitelist: {
                    allow: ["/{{\.*\?}}/"]
                }
            });
            return textlint.lintMarkdown("{{book.console}}").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
    });
});
