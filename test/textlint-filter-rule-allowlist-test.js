// LICENSE : MIT
"use strict";
import { ASTNodeTypes } from "@textlint/ast-node-types";
import filterRule from "../src/textlint-filter-rule-allowlist";
import reportRule from "textlint-rule-report-node-types";
import path from "path";
import assert from "assert";
import { TextLintCore } from "textlint";

describe("textlint-rule-filter-allowlist", function () {
    context("when allowlistConfigPaths", function () {
        it("should read json and use it as allow words", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allowlistConfigPaths: [path.join(__dirname, "fixtures/allow.json")],
                    },
                }
            );
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
        it("should read yml and use it as allow words", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allowlistConfigPaths: [path.join(__dirname, "fixtures/allow.yml")],
                    },
                }
            );
            return textlint.lintText("allow\n\nYES").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
        it("should read json and use it as allow words", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["NO"],
                        allowlistConfigPaths: [path.join(__dirname, "fixtures/allow.json")],
                    },
                }
            );
            return textlint.lintText("allow\n\nYES\n\nNO").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });
    });
    context("when report and filter type", function () {
        it("should messages is empty", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["text"],
                    },
                }
            );
            return textlint.lintText("text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is not ignored", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Code],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        // not regExp
                        allow: ["`\\d+`"],
                    },
                }
            );
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 1);
            });
        });
        it("should messages is ignore by RegExp", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Code],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/`\\d+`/"],
                    },
                }
            );
            return textlint.lintMarkdown("white `1234` text").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is ignore by RegExp + flag", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Paragraph],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/^={1,4}\\s/m", "This is not error."],
                    },
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
        it("should support multiline", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Paragraph],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/===IGNORE===[\\s\\S]*?===/IGNORE===/m"],
                    },
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
        it("should support Math extension", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Paragraph],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/\\$\\$[\\s\\S]*?\\$\\$/m"],
                    },
                }
            );
            return textlint
                .lintMarkdown(
                    `$$
\\begin{pmatrix}
1 & 0 & 0 \\\\\\ 
0 & 1 & 0 \\\\\\
0 & 0 & 1
\\end{pmatrix}
$$`
                )
                .then(({ messages }) => {
                    assert.equal(messages.length, 0);
                });
        });
        it("should messages is ignore by RegExp", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/{{.*?}}/"],
                    },
                }
            );
            return textlint.lintMarkdown("{{book.console}}").then(({ messages }) => {
                assert.equal(messages.length, 0);
            });
        });

        it("should messages is ignore by RegExp", function () {
            const textlint = new TextLintCore();
            textlint.setupRules(
                {
                    report: reportRule,
                },
                {
                    report: {
                        nodeTypes: [ASTNodeTypes.Str],
                    },
                }
            );
            textlint.setupFilterRules(
                {
                    allowlist: filterRule,
                },
                {
                    allowlist: {
                        allow: ["/#.*{#[a-z.-]+}/g"],
                    },
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
