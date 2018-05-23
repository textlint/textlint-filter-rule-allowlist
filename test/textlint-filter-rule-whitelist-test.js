// LICENSE : MIT
"use strict";
const path = require("path");
const TextLintCore = require("textlint").TextLintCore;
const { ASTNodeTypes } = require("@textlint/ast-node-types");
import filterRule from "../src/textlint-filter-rule-whitelist";
import reportRule from "textlint-rule-report-node-types";

const assert = require("power-assert");
describe("textlint-rule-filter-whitelist", function() {
    context("when whitelistConfigPaths", function() {
        it("should read json and use it as allow words", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        whitelistConfigPaths: [path.join(__dirname, "fixtures/allow.json")]
                    }
                }
            );
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
        it("should read yml and use it as allow words", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        whitelistConfigPaths: [path.join(__dirname, "fixtures/allow.yml")]
                    }
                }
            );
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
        it("should read json and use it as allow words", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["NO"],
                        whitelistConfigPaths: [path.join(__dirname, "fixtures/allow.json")]
                    }
                }
            );
            return textlint.lintText("allow\n\nYES\n\nNO").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
    });
    context("when report and filter type", function() {
        it("should messages is empty", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["text"]
                    }
                }
            );
            return textlint.lintText("text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is not ignored", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Code]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        // not regExp
                        allow: ["`\\d+`"]
                    }
                }
            );
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 1);
            });
        });
        it("should messages is ignore by RegExp", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Code]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["/`\\d+`/"]
                    }
                }
            );
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is ignore by RegExp + flag", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Paragraph]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["/^={1,4}\\s/m", "This is not error."]
                    }
                }
            );
            return textlint
                .lintMarkdown("This is error.=== Title")
                .then(({ messages }) => {
                    assert.equal(messages.length, 1);
                })
                .then(() => {
                    return textlint.lintMarkdown("This is not error.\n\n=== Title").then(({ messages }) => {
                        assert.equal(messages.length, 0);
                    });
                });
        });
        it("should support multiline", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Paragraph]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["/===IGNORE===[\\s\\S]*?===/IGNORE===/m"]
                    }
                }
            );
            return textlint
                .lintMarkdown(
                    `===IGNORE===
ERROR Text, But this range should be ignored!
===/IGNORE===`
                )
                .then(({ messages }) => {
                    assert.equal(messages.length, 0);
                });
        });
        it("should messages is ignore by RegExp", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["/{{.*?}}/"]
                    }
                }
            );
            return textlint.lintMarkdown("{{book.console}}").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is ignore by RegExp", function() {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str]
                    }
                }
            );
            textlint.setupFilterRules(
                {
                    whitelist: filterRule
                },
                {
                    whitelist: {
                        allow: ["/#.*{#[a-z.-]+}/g"]
                    }
                }
            );
            return textlint
                .lintMarkdown(
                    `# JavaScriptとは {#what-is-javascript}
            
# JavaScriptってどのような言語？ {#about-javascript}
`
                )
                .then(({ messages }) => {
                    assert.equal(messages.length, 0);
                });
        });
    });
});
