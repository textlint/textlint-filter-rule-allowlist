# textlint-filter-rule-allowlist

[textlint](https://github.com/textlint) [filter rule](https://github.com/textlint/textlint/blob/master/docs/filter-rule.md "Filter rule") that filters any word by allowing lists.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-filter-rule-allowlist

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "filters": {
        "allowlist": {
            "allow": [
                "ignored-word",
                "/\\d{4}-\\d{2}-\\d{2}/",
                "/===IGNORE===[\\s\\S]*?===\/IGNORE===/m"
            ]
        }
    }
}
```

## Options

- `allow`: `string[]`
    - allowing list String or [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
- `allowlistConfigPaths`: `string[]`
    - File path list that includes allow words.
    - The File path is relative path from your `.textlintrc`.
    - Support file format: JSON, yml
    - Cannot use when using [@textlint/editor](https://github.com/textlint/editor)

For example, you can specify `allowlistConfigPaths` to `.textlintrc`.

```json
{
    "filters": {
        "allowlist": {
            "allowlistConfigPaths": [
                "./allow.json",
                "./allow.yml"
            ]
        }
    }
}
```

These files should be following formats.

`allow.json`:
```
[
  "ignore-word",
  "/yes/i"
]
```

`allow.yml`:
```
- "ignore-word",
- /yes/i
```


## RegExp-like String

This filter rule support [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string).
RegExp-like String is that started with `/` and ended with `/` or `/flag`.

:warning: Yous should escape special characters like `\d` in string literal.
`/\d/` should be `"\\d"`.

For example, you want to ignore `/\d{4}-\d{2}-\d{2}/` pattern, you can write `allow` as follows:

```json
[
  "/\\d{4}-\\d{2}-\\d{2}/"
]
```

### Example: Ignore text by RegExp-like string

Some textlint rule has false-positive about unique noun.
You want to ignore the error about unique noun.

For example, you want to ignore error about `/github/i`, you can write `allow` as follows:

`allow.json`:
```
[
  "/github/i`
]
```

This rule treat RegExp-like string as `/github/ig.`.
`g`(global) flag is added by default.

### Example: Ignore range

You want to ignore error between `===IGNORE===` mark.

`allow.json`:
```
[
  "/===IGNORE===[\\s\\S]*?===/IGNORE===/m`
]
```

**text:**
```
ERROR Text => actual error

===IGNORE===
ERROR Text => it is ignored!
===/IGNORE===

ERROR Text => actual error
```

### Example: Ignore Math extension

You want to ignore math expression(`$$ math expression $$`) in Markdown.

`allow.json`:
```json
[
  "/\\$\\$[\\s\\S]*?\\$\\$/m"
]
```

**text:**
```
$$
\begin{pmatrix}
1 & 0 & 0 \\\ 
0 & 1 & 0 \\\
0 & 0 & 1
\end{pmatrix}
$$
```

For more information, see [textlint/regexp-string-matcher – Example](https://github.com/textlint/regexp-string-matcher#examples)

## Changelog

See [Releases page](https://github.com/textlint/textlint-filter-rule-allowlist/releases).

### Rename: `textlint-filter-rule-whitelist` to `textlint-filter-rule-allowlist`

The original name of this filter rule is `textlint-filter-rule-whitelist`.
We have migrated to use `textlint-filter-rule-allowlist`.

For more details, see following issue.

- [Rename whitelist to allowlist](https://github.com/textlint/textlint-filter-rule-allowlist/pull/9)

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint/textlint-filter-rule-allowlist/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
