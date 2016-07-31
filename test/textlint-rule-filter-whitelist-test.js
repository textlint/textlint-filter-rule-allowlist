// LICENSE : MIT
"use strict";
const TextLintCore = require("textlint").TextLintCore;
const TextLintNodeType = require("textlint").TextLintNodeType;
import filterRule from "../src/textlint-rule-filter-whitelist";
import reportRule from "textlint-rule-report-node-types";
const assert = require("power-assert");
describe("textlint-rule-filter-whitelist", function() {
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
            return textlint.lintText("text").then(({messages}) => {
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
            return textlint.lintMarkdown("white `1234` text").then(({messages}) => {
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
            return textlint.lintMarkdown("white `1234` text").then(({messages}) => {
                assert.equal(messages.length, 0);
            });
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
            return textlint.lintMarkdown("{{book.console}}").then(({messages}) => {
                assert.equal(messages.length, 0);
            });
        });
    });
});